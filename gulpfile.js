const { parallel, src, dest, watch, series } = require('gulp')
const mergeStream = require('merge-stream')
const sass = require('sass')
const yupSass = require('gulp-sass')(sass)
const gulpZip = require('gulp-zip')
const pkg = require('pkg')
const path = require('path')
const del = require('del')
const minify = require('gulp-minify')
const rename = require('gulp-rename')

const chromeManifest = require('./src/web/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/web/vendor/firefox/manifest.json')
const operaManifest = require('./src/web/vendor/opera/manifest.json')
const edgeManifest = require('./src/web/vendor/edge/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const CORE_PATH = './src/core'
const WEB_PATH = './src/web'
const PC_PATH = './src/pc'

const getCorePath = (p) => path.join(CORE_PATH, p)
const getWebPath = (p) => path.join(WEB_PATH, p)
const getPCPath = (p) => path.join(PC_PATH, p)

const dot2Underscore = (v = '') => v.replace(/\./g, '_')

const DIST_FILE_NAME = {
  CHROME: `ZaDark-Chrome-${dot2Underscore(chromeManifest.version)}`,
  FIREFOX: `ZaDark-Firefox-${dot2Underscore(firefoxManifest.version)}`,
  OPERA: `ZaDark-Opera-${dot2Underscore(operaManifest.version)}`,
  EDGE: `ZaDark-Edge-${dot2Underscore(edgeManifest.version)}`,
  MACOS: `ZaDark-macOS-${dot2Underscore(pcPackageJSON.version)}`,
  WINDOWS: `ZaDark-Windows-${dot2Underscore(pcPackageJSON.version)}`
}

const safariResources = getWebPath('./vendor/safari/ZaDark Extension/Resources')

const buildSass = (_src, _dest) => {
  return src(_src)
    .pipe(yupSass({ outputStyle: 'compressed', outFile: '.min.css' }).on('error', yupSass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
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
  return src(getCorePath('./scss/**/*.scss'))
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./build/chrome/css'))
    .pipe(dest('./build/firefox/css'))
    .pipe(dest('./build/opera/css'))
    .pipe(dest('./build/edge/css'))
    .pipe(dest(path.join(safariResources, '/css')))
    .pipe(dest('./build/pc/assets/css'))
}

const buildWebStyles = () => {
  return src(getWebPath('./scss/**/*.scss'))
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./build/chrome/css'))
    .pipe(dest('./build/firefox/css'))
    .pipe(dest('./build/opera/css'))
    .pipe(dest('./build/edge/css'))
    .pipe(dest(path.join(safariResources, '/css')))
}

const buildWeb = (browser) => {
  const rootDir = `./build/${browser}`
  const jsDir = `./build/${browser}/js`
  const cssDir = `./build/${browser}/css`
  const localesDir = `./build/${browser}/_locales`
  const libsDir = `./build/${browser}/libs`
  const imagesDir = `./build/${browser}/images`
  const fontsDir = `./build/${browser}/fonts`
  const rulesDir = `./build/${browser}/rules`

  const copyRulesJSON = browser !== 'firefox'
    ? [src(getWebPath('./rules/**/*')).pipe(dest(rulesDir))]
    : []

  return mergeStream(
    src(getWebPath(`./vendor/${browser}/manifest.json`)).pipe(dest(rootDir)),
    // src(getWebPath(`./vendor/${browser}/browser.js`)).pipe(dest(jsDir)),
    // src(getWebPath(`./vendor/${browser}/service-worker.js`)).pipe(dest(jsDir)),
    buildSass(getWebPath(`./vendor/${browser}/*.scss`), cssDir),

    src(getWebPath('./_locales/**/*')).pipe(dest(localesDir)),
    src(getWebPath('./libs/**/*')).pipe(dest(libsDir)),
    //
    // src(getWebPath('./js/**/*')).pipe(dest(jsDir)),
    src([
      getWebPath(`./vendor/${browser}/browser.js`),
      getWebPath(`./vendor/${browser}/service-worker.js`),
      getWebPath('./js/**/*')
    ]).pipe(minify({
      ext: {
        min: '.min.js'
      },
      ignoreFiles: ['.min.js'],
      noSource: true
    })).pipe(dest(jsDir)),
    //
    src(getWebPath('./images/**/*')).pipe(dest(imagesDir)),
    src(getCorePath('./fonts/**/*')).pipe(dest(fontsDir)),
    src(getWebPath('./*.html')).pipe(dest(rootDir)),

    ...copyRulesJSON
  )
}

const buildChrome = () => {
  return buildWeb('chrome')
}

const buildFirefox = () => {
  return buildWeb('firefox')
}

const buildOpera = () => {
  return buildWeb('opera')
}

const buildEdge = () => {
  return buildWeb('edge')
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
    src(getWebPath('./vendor/safari/manifest.json')).pipe(dest(safariResources)),
    // src(getWebPath('./vendor/safari/browser.js')).pipe(dest(jsDir)),
    // src(getWebPath('./vendor/safari/service-worker.js')).pipe(dest(jsDir)),
    buildSass(getWebPath('./vendor/safari/*.scss'), cssDir),

    src(getWebPath('./_locales/**/*')).pipe(dest(localesDir)),
    src(getWebPath('./libs/**/*')).pipe(dest(libsDir)),
    //
    // src(getWebPath('./js/**/*')).pipe(dest(jsDir)),
    src([
      getWebPath('./vendor/safari/browser.js'),
      getWebPath('./vendor/safari/service-worker.js'),
      getWebPath('./js/**/*')
    ]).pipe(minify({
      ext: {
        min: '.min.js'
      },
      ignoreFiles: ['.min.js'],
      noSource: true
    })).pipe(dest(jsDir)),
    //
    src(getCorePath('./fonts/**/*')).pipe(dest(fontsDir)),
    src(getWebPath('./rules/**/*')).pipe(dest(rulesDir)),
    src(getWebPath('./*.html')).pipe(dest(safariResources))
  )
}

const buildPC = () => {
  return mergeStream(
    src([
      getPCPath('./**/*'),
      `!${getPCPath('./assets/scss/**')}`,
      `!${getPCPath('./assets/js/**')}`
    ]).pipe(dest('./build/pc')),
    src(getCorePath('./fonts/**/*')).pipe(dest('./build/pc/assets/fonts')),
    buildSass(getPCPath('./assets/scss/*.scss'), './build/pc/assets/css'),
    src(getPCPath('./assets/js/*.js')).pipe(minify({
      ext: {
        min: '.min.js'
      },
      ignoreFiles: ['.min.js'],
      noSource: true
    })).pipe(dest('./build/pc/assets/js'))
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
)

// Exports

const buildAll = series(
  parallel(cleanBuild, cleanSafariResources),
  parallel(
    buildCoreStyles,
    buildWebStyles,
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
    getCorePath('./**/*'),
    getWebPath('./**/*'),
    getPCPath('./**/*'),
    `!${getWebPath('./vendor/safari/ZaDark/**/*')}`,
    `!${getWebPath('./vendor/safari/ZaDark Extension/**/*')}`,
    `!${getWebPath('./vendor/safari/ZaDark.xcodeproj/**/')}`
  ], buildAll)
}

exports.build = buildAll
exports.dist = distAll
exports.watch = watchAll
