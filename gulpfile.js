const { parallel, src, dest, watch, series } = require('gulp')
const mergeStream = require('merge-stream')
const gulpClean = require('gulp-clean')
const sass = require('sass')
const yupSass = require('gulp-sass')(sass)
const gulpZip = require('gulp-zip')
const { compile } = require('nexe')

const chromeManifest = require('./src/browser-ext/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/browser-ext/vendor/firefox/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const FILE_NAME = {
  CHROME: `ZaDark-Chrome-${chromeManifest.version}`,
  FIREFOX: `ZaDark-Firefox-${firefoxManifest.version}`,
  MACOS: `ZaDark-macOS-${pcPackageJSON.version}`,
  WINDOWS: `ZaDark-Windows-${pcPackageJSON.version}`
}

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
    .pipe(dest('./build/firefox/css'))
    .pipe(dest('./build/chrome/css'))
    .pipe(dest('./build/pc/assets/css'))
}

const buildBrowserExtStyles = () => {
  return src('./src/browser-ext/scss/**/*.scss')
    .pipe(yupSass({ outputStyle: 'compressed' }).on('error', yupSass.logError))
    .pipe(dest('./build/firefox/css'))
    .pipe(dest('./build/chrome/css'))
}

const buildChrome = () => {
  return mergeStream(
    src('./src/browser-ext/vendor/chrome/manifest.json').pipe(dest('./build/chrome')),
    src('./src/browser-ext/vendor/chrome/browser.js').pipe(dest('./build/chrome/js')),
    src('./src/browser-ext/vendor/chrome/background.js').pipe(dest('./build/chrome/js')),

    src('./src/browser-ext/vendor/chrome/images/**/*').pipe(dest('./build/chrome/images')),
    src('./src/browser-ext/vendor/chrome/welcome.html').pipe(dest('./build/chrome')),

    src('./src/browser-ext/libs/**/*').pipe(dest('./build/chrome/libs')),
    src('./src/browser-ext/js/**/*').pipe(dest('./build/chrome/js')),
    src('./src/browser-ext/css/**/*').pipe(dest('./build/chrome/css')),
    src('./src/browser-ext/images/**/*').pipe(dest('./build/chrome/images')),

    src('./src/browser-ext/*.html').pipe(dest('./build/chrome'))
  )
}

const buildFirefox = () => {
  return mergeStream(
    src('./src/browser-ext/vendor/firefox/manifest.json').pipe(dest('./build/firefox')),
    src('./src/browser-ext/vendor/firefox/browser.js').pipe(dest('./build/firefox/js')),
    src('./src/browser-ext/vendor/firefox/background.js').pipe(dest('./build/firefox/js')),

    src('./src/browser-ext/vendor/firefox/images/**/*').pipe(dest('./build/firefox/images')),
    src('./src/browser-ext/vendor/firefox/welcome.html').pipe(dest('./build/firefox')),

    src('./src/browser-ext/libs/**/*').pipe(dest('./build/firefox/libs')),
    src('./src/browser-ext/js/**/*').pipe(dest('./build/firefox/js')),
    src('./src/browser-ext/css/**/*').pipe(dest('./build/firefox/css')),
    src('./src/browser-ext/images/**/*').pipe(dest('./build/firefox/images')),

    src('./src/browser-ext/*.html').pipe(dest('./build/firefox'))
  )
}

const buildPC = () => {
  return src('./src/pc/**/*').pipe(dest('./build/pc'))
}

// Compile

const compileMacOS = () => {
  return new Promise((resolve, reject) => {
    // macOS
    compile({
      input: './build/pc/index.js',
      output: `./dist/macOS/${FILE_NAME.MACOS}.command`,
      resources: './build/pc/assets/**/*',
      targets: 'mac-x64-14.15.3',
      silent: true
    }).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}

const compileWindows = () => {
  return new Promise((resolve, reject) => {
    // Windows
    compile({
      input: './build/pc/index.js',
      output: `./dist/Windows/${FILE_NAME.WINDOWS}.exe`,
      resources: './build/pc/assets/**/*',
      targets: 'windows-x86-14.15.3',
      silent: true
    }).then(() => {
      resolve(true)
    }).catch((error) => {
      reject(error)
    })
  })
}

// Zip
const zipMacOS = () => {
  return src(`./dist/macOS/${FILE_NAME.MACOS}.command`)
    .pipe(gulpZip(`${FILE_NAME.MACOS}.zip`))
    .pipe(dest('./dist/macOS'))
}
const zipWindows = () => {
  return src(`./dist/Windows/${FILE_NAME.WINDOWS}.exe`)
    .pipe(gulpZip(`${FILE_NAME.WINDOWS}.zip`))
    .pipe(dest('./dist/Windows'))
}

// Dist

const chromeDist = () => {
  return src('./build/chrome/**')
    .pipe(gulpZip(`${FILE_NAME.CHROME}.zip`))
    .pipe(dest('./dist/chrome'))
}

const firefoxDist = () => {
  return src('./build/firefox/**')
    .pipe(gulpZip(`${FILE_NAME.FIREFOX}.zip`))
    .pipe(dest('./dist/firefox'))
}

const macOSDist = series(compileMacOS, zipMacOS)
const windowsDist = series(compileWindows, zipWindows)

// Exports

const buildAll = series(
  cleanBuild,
  parallel(
    buildCoreStyles,
    buildBrowserExtStyles,
    buildChrome,
    buildFirefox,
    buildPC
  )
)

const distAll = series(
  buildAll,
  cleanDist,
  parallel(
    chromeDist,
    firefoxDist,
    macOSDist,
    windowsDist
  )
)

const watchAll = () => {
  watch('src/**/*', buildAll)
}

exports.build = buildAll
exports.dist = distAll
exports.watch = watchAll
