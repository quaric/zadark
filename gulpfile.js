const { parallel, src, dest, watch, series } = require('gulp')
const mergeStream = require('merge-stream')
const sass = require('sass')
const yupSass = require('gulp-sass')(sass)
const gulpZip = require('gulp-zip')
const pkg = require('pkg')
const path = require('path')
const del = require('del')

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

const safariResources = './src/browser-ext/vendor/safari/ZaDark Extension/Resources'

const buildSass = (_src, _dest) => {
  return src(_src)
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(dest(_dest))
}

// Clean

const cleanBuild = () => {
  return del('build')
}

const cleanDist = () => {
  return del('dist')
}

// Build

const buildCoreStyles = () => {
  return src('./src/core/scss/**/*.scss')
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
  const rootDir = `./build/${browser}`
  const jsDir = `./build/${browser}/js`
  const cssDir = `./build/${browser}/css`
  const localesDir = `./build/${browser}/_locales`
  const libsDir = `./build/${browser}/libs`
  const imagesDir = `./build/${browser}/images`
  const fontsDir = `./build/${browser}/fonts`
  const rulesDir = `./build/${browser}/rules`

  const copyRulesJSON = browser !== 'firefox'
    ? [src('./src/browser-ext/rules/**/*').pipe(dest(rulesDir))]
    : []

  return mergeStream(
    src(`./src/browser-ext/vendor/${browser}/manifest.json`).pipe(dest(rootDir)),
    src(`./src/browser-ext/vendor/${browser}/browser.js`).pipe(dest(jsDir)),
    src(`./src/browser-ext/vendor/${browser}/background.js`).pipe(dest(jsDir)),
    buildSass(`./src/browser-ext/vendor/${browser}/*.scss`, cssDir),

    src('./src/browser-ext/_locales/**/*').pipe(dest(localesDir)),
    src('./src/browser-ext/libs/**/*').pipe(dest(libsDir)),
    src('./src/browser-ext/js/**/*').pipe(dest(jsDir)),
    src('./src/browser-ext/images/**/*').pipe(dest(imagesDir)),
    src('./src/core/fonts/**/*').pipe(dest(fontsDir)),
    src('./src/browser-ext/*.html').pipe(dest(rootDir)),
    ...copyRulesJSON
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

const cleanSafariResources = () => {
  const patterns = [
    path.join(safariResources, '**/*'),
    `!${path.join(safariResources, 'images')}`,
    `!${path.join(safariResources, '.gitkeep')}`
  ]
  return del(patterns)
}

const buildSafari = () => {
  const jsDir = path.join(safariResources, '/js')
  const cssDir = path.join(safariResources, '/css')
  const localesDir = path.join(safariResources, '/_locales')
  const libsDir = path.join(safariResources, '/libs')
  const fontsDir = path.join(safariResources, '/fonts')
  const rulesDir = path.join(safariResources, '/rules')

  return mergeStream(
    src('./src/browser-ext/vendor/safari/manifest.json').pipe(dest(safariResources)),
    src('./src/browser-ext/vendor/safari/browser.js').pipe(dest(jsDir)),
    src('./src/browser-ext/vendor/safari/background.js').pipe(dest(jsDir)),
    buildSass('./src/browser-ext/vendor/safari/*.scss', cssDir),

    src('./src/browser-ext/_locales/**/*').pipe(dest(localesDir)),
    src('./src/browser-ext/libs/**/*').pipe(dest(libsDir)),
    src('./src/browser-ext/js/**/*').pipe(dest(jsDir)),
    src('./src/core/fonts/**/*').pipe(dest(fontsDir)),
    src('./src/browser-ext/rules/**/*').pipe(dest(rulesDir)),
    src('./src/browser-ext/*.html').pipe(dest(safariResources))
  )
}

const buildPC = () => {
  return mergeStream(
    src([
      './src/pc/**/*',
      '!./src/pc/assets/scss/**'
    ]).pipe(dest('./build/pc')),
    src('./src/core/fonts/**/*').pipe(dest('./build/pc/assets/fonts')),
    buildSass('./src/pc/assets/scss/*.scss', './build/pc/assets/css')
  )
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

// const zipMacOS = () => {
//   return src(`./dist/macOS/${DIST_FILE_NAME.MACOS}`)
//     .pipe(gulpZip(`${DIST_FILE_NAME.MACOS}.zip`))
//     .pipe(dest('./dist/macOS'))
// }

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
  zipWindows
  // parallel(zipMacOS, zipWindows)
)

// Exports

const buildAll = series(
  parallel(cleanBuild, cleanSafariResources),
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
  watch([
    'src/core/**/*',
    'src/pc/**/*',
    'src/browser-ext/**/*',
    '!src/browser-ext/vendor/safari/ZaDark/**/*',
    '!src/browser-ext/vendor/safari/ZaDark Extension/**/*',
    '!src/browser-ext/vendor/safari/ZaDark.xcodeproj/**/*'
  ], buildAll)
}

exports.build = buildAll
exports.dist = distAll
exports.watch = watchAll
