const { parallel, src, dest, watch, series } = require('gulp')
const mergeStream = require('merge-stream')
const sass = require('sass')
const yupSass = require('gulp-sass')(sass)
const gulpZip = require('gulp-zip')
const tar = require('gulp-tar')
const gzip = require('gulp-gzip')
const pkg = require('pkg')
const path = require('path')
const del = require('del')
const minify = require('gulp-minify')
const concat = require('gulp-concat')
const sort = require('gulp-sort')
const rename = require('gulp-rename')
const hashsum = require('gulp-hashsum')
const resedit = require('resedit/cjs')
const fs = require('fs')

const distUtils = require('./dist-utils')

const CORE_PATH = './src/core'
const WEB_PATH = './src/web'
const PC_PATH = './src/pc'

const getCorePath = (p) => path.join(CORE_PATH, p)
const getWebPath = (p) => path.join(WEB_PATH, p)
const getPCPath = (p) => path.join(PC_PATH, p)

const SAFARI_RESOURCES = getWebPath('./vendor/safari/ZaDark Extension/Resources')

const isDevelopment = process.env.NODE_ENV === 'development'

const minifyOptions = {
  ext: {
    min: '.min.js'
  },
  ignoreFiles: ['.min.js'],
  noSource: true,
  compress: {
    global_defs: {
      DEBUG: isDevelopment,
      ZADARK_API_DOMAIN: isDevelopment
        ? 'http://localhost:5555'
        : 'https://api.zadark.com',
      ZADARK_API_URL: isDevelopment
        ? 'http://localhost:5555/v1'
        : 'https://api.zadark.com/v1'
    }
  },
  output: {
    beautify: isDevelopment
  }
}

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

// const cleanDist = () => {
//   return del('dist')
// }

// Build

const buildCoreStyles = () => {
  return src(getCorePath('./scss/**/*.scss'))
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./build/chrome/css'))
    .pipe(dest('./build/firefox/css'))
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

  return mergeStream(
    src(getWebPath(`./vendor/${browser}/manifest.json`)).pipe(dest(rootDir)),
    src(getWebPath('./*.html')).pipe(dest(rootDir)),

    src([
      getWebPath(`./vendor/${browser}/browser.js`),
      getWebPath(`./vendor/${browser}/service-worker.js`),
      getWebPath('./js/**/*'),
      getCorePath('./js/**/*')
    ]).pipe(minify(minifyOptions)).pipe(dest(jsDir)),
    buildSass(getWebPath(`./vendor/${browser}/*.scss`), cssDir),

    src(getWebPath('./_locales/**/*')).pipe(dest(localesDir)),
    // src(getWebPath('./libs/**/*')).pipe(dest(libsDir)),
    src(getWebPath('./libs/**/*'))
      .pipe(sort())
      .pipe(concat('libs.min.js'))
      .pipe(dest(libsDir)),
    src(getWebPath('./images/**/*')).pipe(dest(imagesDir)),
    src(getCorePath('./fonts/**/*')).pipe(dest(fontsDir)),
    src(getWebPath('./rules/**/*')).pipe(dest(rulesDir))
  )
}

const buildChrome = () => {
  return buildWeb('chrome')
}

const buildFirefox = () => {
  return buildWeb('firefox')
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

    src([
      getWebPath('./vendor/safari/browser.js'),
      getWebPath('./vendor/safari/service-worker.js'),
      getWebPath('./js/**/*'),
      getCorePath('./js/**/*')
    ]).pipe(minify(minifyOptions)).pipe(dest(jsDir)),

    buildSass(getWebPath('./vendor/safari/*.scss'), cssDir),

    src(getWebPath('./_locales/**/*')).pipe(dest(localesDir)),
    // src(getWebPath('./libs/**/*')).pipe(dest(libsDir)),
    src(getWebPath('./libs/**/*'))
      .pipe(sort())
      .pipe(concat('libs.min.js'))
      .pipe(dest(libsDir)),
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

    src([
      getPCPath('./assets/js/*.js'),
      getCorePath('./js/**/*')
    ]).pipe(minify(minifyOptions)).pipe(dest('./build/pc/assets/js')),

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
      '--targets', 'node16.16.0-macos-x64,node16.16.0-macos-arm64',
      '--output', distUtils.getFilePath('MACOS', true)
    ]).then(() => {
      //
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
      '--targets', 'node16.16.0-win-x64',
      '--output', distUtils.getFilePath('WINDOWS', true)
    ]).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}

const setWindowsExeInfo = async () => {
  const ResEdit = await resedit.load()

  const srcPath = distUtils.getFilePath('WINDOWS', true)
  const destPath = distUtils.getFilePath('WINDOWS', true)

  const iconFilePath = path.join(__dirname, './zadark.ico')
  const iconFileData = ResEdit.Data.IconFile.from(fs.readFileSync(iconFilePath))

  const language = {
    lang: 1033, // English - United States (en-US)
    codepage: 1200 // Unicode UTF-16
  }

  const data = fs.readFileSync(srcPath)
  const executable = ResEdit.NtExecutable.from(data)
  const res = ResEdit.NtExecutableResource.from(executable)
  const ver = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0]

  const versionStr = distUtils.getVersion('WINDOWS')
  const versionArr = versionStr
    .split('.')
    .map((e) => Number(e) || 0)
    .slice(0, 3)

  ver.removeStringValue(language, 'OriginalFilename')
  ver.removeStringValue(language, 'InternalName')

  ver.setProductVersion(...versionArr)
  ver.setFileVersion(...versionArr)

  ver.setStringValues(language, {
    ProductName: 'ZaDark - Zalo Dark Mode',
    FileDescription: `ZaDark for Windows ${versionStr}`,
    LegalCopyright: 'ZaDark by Quaric. MPL-2.0 license.',
    OriginalFilename: distUtils.getFileNameOriginal('WINDOWS')
  })

  ver.outputToResourceEntries(res.entries)

  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    language.lang,
    iconFileData.icons.map(item => item.data)
  )

  res.outputResource(executable)
  fs.writeFileSync(destPath, Buffer.from(executable.generate()))

  return true
}

// Zip

const zipMacOSX64 = () => {
  return src(distUtils.getFilePath('MACOS_X64', true))
    .pipe(rename(distUtils.getFileNameOriginal('MACOS_X64_FRIENDLY')))
    .pipe(gulpZip(distUtils.getFileNameZip('MACOS_X64')))
    .pipe(dest(distUtils.getFileDir('MACOS_X64')))
}

const zipMacOSARM64 = () => {
  return src(distUtils.getFilePath('MACOS_ARM64', true))
    .pipe(rename(distUtils.getFileNameOriginal('MACOS_ARM64_FRIENDLY')))
    .pipe(gulpZip(distUtils.getFileNameZip('MACOS_ARM64')))
    .pipe(dest(distUtils.getFileDir('MACOS_ARM64')))
}

const tarGzipMacOSX64 = () => {
  return src(distUtils.getFilePath('MACOS_X64', true))
    .pipe(rename('zadark'))
    .pipe(tar(distUtils.getFileNameMacOSTar('x64')))
    .pipe(gzip())
    .pipe(dest(distUtils.getFileDir('MACOS_X64')))
}

const tarGzipMacOSARM64 = () => {
  return src(distUtils.getFilePath('MACOS_ARM64', true))
    .pipe(rename('zadark'))
    .pipe(tar(distUtils.getFileNameMacOSTar('arm64')))
    .pipe(gzip())
    .pipe(dest(distUtils.getFileDir('MACOS_ARM64')))
}

const hashsumMacOS = () => {
  const inp = [
    path.join(distUtils.getFileDir('MACOS_X64'), distUtils.getFileNameMacOSTar('x64') + '.gz'),
    path.join(distUtils.getFileDir('MACOS_ARM64'), distUtils.getFileNameMacOSTar('arm64') + '.gz')
  ]
  return src(inp).pipe(hashsum({ hash: 'sha256', dest: distUtils.getFileDir('MACOS_X64') }))
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

const edgeDist = () => {
  return src('./build/edge/**')
    .pipe(gulpZip(distUtils.getFileNameZip('EDGE')))
    .pipe(dest(distUtils.getFileDir('EDGE')))
}

const delTmpFile = (patterns) => {
  return function delTmpFile () {
    return del(patterns)
  }
}

const pcDist = series(
  pkgMacOS,
  pkgWindows,
  setWindowsExeInfo,
  zipMacOSX64,
  zipMacOSARM64,
  tarGzipMacOSX64,
  tarGzipMacOSARM64,
  hashsumMacOS,
  zipWindows,
  parallel(
    delTmpFile(distUtils.getFilePath('MACOS_X64', true)),
    delTmpFile(distUtils.getFilePath('MACOS_ARM64', true)),
    delTmpFile(distUtils.getFilePath('WINDOWS', true))
  )
)

// Exports

const buildAll = series(
  parallel(cleanBuild, cleanSafariResources),
  parallel(
    buildCoreStyles,
    buildWebStyles,
    buildChrome,
    buildFirefox,
    buildEdge,
    buildSafari,
    buildPC
  )
)

const distAll = series(
  buildAll,
  // cleanDist,
  parallel(
    chromeDist,
    firefoxDist,
    edgeDist,
    pcDist
  )
)

const distWeb = series(
  buildAll,
  parallel(
    chromeDist,
    firefoxDist,
    edgeDist
  )
)

const distPC = series(
  buildAll,
  parallel(
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
    `!${getWebPath('./vendor/safari/ZaDark.xcodeproj/**/*')}`
  ], buildAll)
}

const dev = series(buildAll, watchAll)

exports.build = buildAll
exports.dist = distAll
exports.distWeb = distWeb
exports.distPC = distPC
exports.dev = dev
