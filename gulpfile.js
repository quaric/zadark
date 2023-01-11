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

const distUtils = require('./dist-utils')

const CORE_PATH = './src/core'
const WEB_PATH = './src/web'
const PC_PATH = './src/pc'

const getCorePath = (p) => path.join(CORE_PATH, p)
const getWebPath = (p) => path.join(WEB_PATH, p)
const getPCPath = (p) => path.join(PC_PATH, p)

const SAFARI_RESOURCES = getWebPath('./vendor/safari/ZaDark Extension/Resources')

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
    .pipe(dest(path.join(SAFARI_RESOURCES, '/css')))
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
    .pipe(dest(path.join(SAFARI_RESOURCES, '/css')))
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
    src(getWebPath('./*.html')).pipe(dest(rootDir)),

    // src(getWebPath(`./vendor/${browser}/browser.js`)).pipe(dest(jsDir)),
    // src(getWebPath(`./vendor/${browser}/service-worker.js`)).pipe(dest(jsDir)),
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
    buildSass(getWebPath(`./vendor/${browser}/*.scss`), cssDir),

    src(getWebPath('./_locales/**/*')).pipe(dest(localesDir)),
    src(getWebPath('./libs/**/*')).pipe(dest(libsDir)),
    src(getWebPath('./images/**/*')).pipe(dest(imagesDir)),
    src(getCorePath('./fonts/**/*')).pipe(dest(fontsDir)),
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
    path.join(SAFARI_RESOURCES, '**/*'),
    `!${path.join(SAFARI_RESOURCES, 'images')}`,
    `!${path.join(SAFARI_RESOURCES, '.gitkeep')}`
  ]
  return del(patterns)
}

const buildSafari = () => {
  const jsDir = path.join(SAFARI_RESOURCES, '/js')
  const cssDir = path.join(SAFARI_RESOURCES, '/css')
  const localesDir = path.join(SAFARI_RESOURCES, '/_locales')
  const libsDir = path.join(SAFARI_RESOURCES, '/libs')
  const fontsDir = path.join(SAFARI_RESOURCES, '/fonts')
  const rulesDir = path.join(SAFARI_RESOURCES, '/rules')

  return mergeStream(
    src(getWebPath('./vendor/safari/manifest.json')).pipe(dest(SAFARI_RESOURCES)),
    src(getWebPath('./*.html')).pipe(dest(SAFARI_RESOURCES)),

    // src(getWebPath('./vendor/safari/browser.js')).pipe(dest(jsDir)),
    // src(getWebPath('./vendor/safari/service-worker.js')).pipe(dest(jsDir)),
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

    buildSass(getWebPath('./vendor/safari/*.scss'), cssDir),

    src(getWebPath('./_locales/**/*')).pipe(dest(localesDir)),
    src(getWebPath('./libs/**/*')).pipe(dest(libsDir)),
    src(getCorePath('./fonts/**/*')).pipe(dest(fontsDir)),
    src(getWebPath('./rules/**/*')).pipe(dest(rulesDir))
  )
}

const buildPC = () => {
  return mergeStream(
    src([
      getPCPath('./**/*'),
      `!${getPCPath('./assets/scss/**')}`,
      `!${getPCPath('./assets/js/**')}`
    ]).pipe(dest('./build/pc')),

    src(getPCPath('./assets/js/*.js')).pipe(minify({
      ext: {
        min: '.min.js'
      },
      ignoreFiles: ['.min.js'],
      noSource: true
    })).pipe(dest('./build/pc/assets/js')),

    src(getCorePath('./fonts/**/*')).pipe(dest('./build/pc/assets/fonts')),
    buildSass(getPCPath('./assets/scss/*.scss'), './build/pc/assets/css')
  )
}

// Package

const pkgMacOS = () => {
  return new Promise((resolve, reject) => {
    pkg.exec([
      './build/pc/index.js',
      '--config', './pkg.config.json',
      '--targets', 'node14-macos-x64',
      '--output', distUtils.getFilePath('MACOS', true)
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
      '--output', distUtils.getFilePath('WINDOWS', true)
    ]).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}

// Zip

const zipMacOS = () => {
  return src(distUtils.getFilePath('MACOS', true))
    .pipe(gulpZip(distUtils.getFileNameZip('MACOS')))
    .pipe(dest(distUtils.getFileDir('MACOS')))
}

const zipWindows = () => {
  return src(distUtils.getFilePath('WINDOWS', true))
    .pipe(gulpZip(distUtils.getFileNameZip('WINDOWS')))
    .pipe(dest(distUtils.getFileDir('WINDOWS')))
}

// Dist

const chromeDist = () => {
  return src('./build/chrome/**')
    .pipe(gulpZip(distUtils.getFileNameZip('CHROME')))
    .pipe(dest(distUtils.getFileDir('CHROME')))
}

const firefoxDist = () => {
  return src('./build/firefox/**')
    .pipe(gulpZip(distUtils.getFileNameZip('FIREFOX')))
    .pipe(dest(distUtils.getFileDir('FIREFOX')))
}

const operaDist = () => {
  return src('./build/opera/**')
    .pipe(gulpZip(distUtils.getFileNameZip('OPERA')))
    .pipe(dest(distUtils.getFileDir('OPERA')))
}

const edgeDist = () => {
  return src('./build/edge/**')
    .pipe(gulpZip(distUtils.getFileNameZip('EDGE')))
    .pipe(dest(distUtils.getFileDir('EDGE')))
}

const pcDist = series(
  pkgMacOS,
  pkgWindows,
  zipMacOS,
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
