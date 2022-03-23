const { parallel, src, dest, watch, series } = require('gulp')
const mergeStream = require('merge-stream')
const gulpClean = require('gulp-clean')
const sass = require('sass')
const yupSass = require('gulp-sass')(sass)
const gulpZip = require('gulp-zip')
const pkg = require('pkg')
const path = require('path')

const chromeManifest = require('./src/browser-ext/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/browser-ext/vendor/firefox/manifest.json')
const operaManifest = require('./src/browser-ext/vendor/opera/manifest.json')
const edgeManifest = require('./src/browser-ext/vendor/edge/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const dot2Underscore = (v = '') => v.replace(/\./g, '_')

const DIST_FILE_NAME = {
  CHROME: `ZaDark-Chrome-${dot2Underscore(chromeManifest.version)}`,
  FIREFOX: `ZaDark-Firefox-${dot2Underscore(firefoxManifest.version)}`,
  OPERA: `ZaDark-Opera-${dot2Underscore(operaManifest.version)}`,
  EDGE: `ZaDark-Edge-${dot2Underscore(edgeManifest.version)}`,
  MACOS: `ZaDark-macOS-${dot2Underscore(pcPackageJSON.version)}`,
  WINDOWS: `ZaDark-Windows-${dot2Underscore(pcPackageJSON.version)}`
}

const safariResources = './src/safari/ZaDark Extension/Resources'

// Clean

const cleanBuild = () => {
  return src('build', { read: false, allowEmpty: true }).pipe(gulpClean())
}

const cleanDist = () => {
  return src('dist', { read: false, allowEmpty: true }).pipe(gulpClean())
}

// Build

const buildCoreStyles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(dest('./build/chrome/css'))
    .pipe(dest('./build/firefox/css'))
    .pipe(dest('./build/opera/css'))
    .pipe(dest('./build/edge/css'))
    .pipe(dest(path.join(safariResources, '/css')))
    .pipe(dest('./build/pc/assets/css'))
}

const buildBrowserExtStyles = () => {
  return src('./src/browser-ext/scss/**/*.scss')
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(dest('./build/chrome/css'))
    .pipe(dest('./build/firefox/css'))
    .pipe(dest('./build/opera/css'))
    .pipe(dest('./build/edge/css'))
    .pipe(dest(path.join(safariResources, '/css')))
}

const buildBrowserExt = (browser) => {
  return mergeStream(
    src(`./src/browser-ext/vendor/${browser}/manifest.json`).pipe(dest(`./build/${browser}`)),
    src(`./src/browser-ext/vendor/${browser}/browser.js`).pipe(dest(`./build/${browser}/js`)),
    src(`./src/browser-ext/vendor/${browser}/background.js`).pipe(dest(`./build/${browser}/js`)),

    src('./src/browser-ext/libs/**/*').pipe(dest(`./build/${browser}/libs`)),
    src('./src/browser-ext/js/**/*').pipe(dest(`./build/${browser}/js`)),
    src('./src/browser-ext/css/**/*').pipe(dest(`./build/${browser}/css`)),
    src('./src/browser-ext/images/**/*').pipe(dest(`./build/${browser}/images`)),

    src('./src/browser-ext/*.html').pipe(dest(`./build/${browser}`))
  )
}

const buildChrome = () => {
  return buildBrowserExt('chrome')
}

const buildFirefox = () => {
  return buildBrowserExt('firefox')
}

const buildOpera = () => {
  return buildBrowserExt('opera')
}

const buildEdge = () => {
  return buildBrowserExt('edge')
}

const buildSafari = () => {
  const jsDir = path.join(safariResources, '/js')

  return mergeStream(
    src('./src/browser-ext/vendor/safari/manifest.json').pipe(dest(safariResources)),
    src('./src/browser-ext/vendor/safari/browser.js').pipe(dest(jsDir)),
    src('./src/browser-ext/vendor/safari/background.js').pipe(dest(jsDir)),

    src('./src/browser-ext/libs/**/*').pipe(dest(path.join(safariResources, '/libs'))),
    src('./src/browser-ext/js/**/*').pipe(dest(jsDir)),

    src('./src/browser-ext/*.html').pipe(dest(safariResources))
  )
}

const buildPC = () => {
  return src('./src/pc/**/*').pipe(dest('./build/pc'))
}

// Package

const pkgMacOS = () => {
  return new Promise((resolve, reject) => {
    pkg.exec([
      './build/pc/index.js',
      '--config', './pkg.config.json',
      '--targets', 'node14-macos-x64',
      '--output', `./dist/macos/${DIST_FILE_NAME.MACOS}`
    ]).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}

const pkgWindows = () => {
  return new Promise((resolve, reject) => {
    pkg.exec([
      './build/pc/index.js',
      '--config', './pkg.config.json',
      '--targets', 'node14-win-x64',
      '--output', `./dist/windows/${DIST_FILE_NAME.WINDOWS}`
    ]).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}

// Zip

const zipMacOS = () => {
  return src(`./dist/macOS/${DIST_FILE_NAME.MACOS}`)
    .pipe(gulpZip(`${DIST_FILE_NAME.MACOS}.zip`))
    .pipe(dest('./dist/macOS'))
}

const zipWindows = () => {
  return src(`./dist/Windows/${DIST_FILE_NAME.WINDOWS}.exe`)
    .pipe(gulpZip(`${DIST_FILE_NAME.WINDOWS}.zip`))
    .pipe(dest('./dist/Windows'))
}

// Dist

const chromeDist = () => {
  return src('./build/chrome/**')
    .pipe(gulpZip(`${DIST_FILE_NAME.CHROME}.zip`))
    .pipe(dest('./dist/chrome'))
}

const firefoxDist = () => {
  return src('./build/firefox/**')
    .pipe(gulpZip(`${DIST_FILE_NAME.FIREFOX}.zip`))
    .pipe(dest('./dist/firefox'))
}

const operaDist = () => {
  return src('./build/opera/**')
    .pipe(gulpZip(`${DIST_FILE_NAME.OPERA}.zip`))
    .pipe(dest('./dist/opera'))
}

const edgeDist = () => {
  return src('./build/edge/**')
    .pipe(gulpZip(`${DIST_FILE_NAME.EDGE}.zip`))
    .pipe(dest('./dist/edge'))
}

const pcDist = series(
  pkgMacOS,
  pkgWindows,
  parallel(zipMacOS, zipWindows)
)

// Exports

const buildAll = series(
  cleanBuild,
  parallel(
    buildCoreStyles,
    buildBrowserExtStyles,
    buildChrome,
    buildFirefox,
    buildOpera,
    buildEdge,
    buildSafari,
    buildPC
  )
)

const distAll = series(
  buildAll,
  cleanDist,
  parallel(
    chromeDist,
    firefoxDist,
    operaDist,
    edgeDist,
    pcDist
  )
)

const watchAll = () => {
  watch('src/**/*', buildAll)
}

exports.build = buildAll
exports.dist = distAll
exports.watch = watchAll
