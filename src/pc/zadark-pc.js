/*
  ZaDark – Zalo Dark Mode
  Made by NCDAi Studio
*/

const fs = require('fs')
const path = require('path')
const del = require('del')
const chalk = require('chalk')
const asar = require('asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { log, logDebug, copyRecursiveSync } = require('./utils')
const { PLATFORM } = require('./constants')

const getZaloResDirList = (customZaloPath) => {
  if (!['darwin', 'win32'].includes(PLATFORM)) {
    throw new Error(`Khong ho tro he dieu hanh "${PLATFORM}".`)
  }

  const resourcesPath = PLATFORM === 'darwin'
    ? path.join(customZaloPath, './Contents/Resources')
    : path.join(customZaloPath, './Zalo-*/resources')

  const resources = glob.sync(resourcesPath)

  if (!Array.isArray(resources) || !resources.length) {
    return []
  }

  return resources.sort()
}

const writeIndexFile = (zaloDir, { darkTheme, isSyncWithSystem }) => {
  const src = 'pc-dist/index.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' khong ton tai.')
  }

  const indexHTMLContent = fs.readFileSync(srcPath, 'utf8')
  const root = HTMLParser.parse(indexHTMLContent)

  const htmlElement = root.getElementsByTagName('html')[0]
  const headElement = root.getElementsByTagName('head')[0]
  const bodyElement = root.getElementsByTagName('body')[0]

  // Required font
  const zaDarkFont = root.querySelectorAll('link[href="zadark/css/zadark-fonts.css"]')
  if (!zaDarkFont.length) {
    headElement.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="zadark/css/zadark-fonts.css">'
    )
  }

  // Required stylesheet
  const zaDarkCSS = root.querySelectorAll('link[href="zadark/css/zadark.css"]')
  if (!zaDarkCSS.length) {
    headElement.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="zadark/css/zadark.css">'
    )
  }

  if (isSyncWithSystem) {
    // Required script
    const zaDarkSWSScript = root.querySelectorAll('script[src="zadark/js/zadark-sws.js"]')
    if (!zaDarkSWSScript.length) {
      bodyElement.insertAdjacentHTML(
        'beforeend',
        '<script src="zadark/js/zadark-sws.js"></script>'
      )
    }
  }

  // Required themeAttributes
  htmlElement.setAttribute('data-theme-mode', 'dark')
  htmlElement.setAttribute('data-dark-theme', darkTheme)

  // Required classNames
  const zaDarkClassNames = ['zadark', 'zadark-pc', `zadark-${PLATFORM}`]
  zaDarkClassNames.forEach((className) => {
    bodyElement.classList.add(className)
  })

  fs.writeFileSync(srcPath, root.toString())
  logDebug('- writeIndexFile', srcPath)
}

const copyAssetDir = (zaloDir, { dest, src }) => {
  const srcPath = path.join(__dirname, `./assets/${src}`)
  const destPath = path.join(zaloDir, `app/${dest}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' doesn\'t exist.')
  }

  copyRecursiveSync(srcPath, destPath)

  logDebug('- copyAssetDir', src, '➜', destPath)
}

const installDarkTheme = async (zaloDir, darkTheme = 'dark', isSyncWithSystem = false) => {
  if (!fs.existsSync(zaloDir)) {
    throw new Error(zaloDir + ' khong ton tai.')
  }

  const appDirPath = path.join(zaloDir, 'app')
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (!fs.existsSync(appAsarPath)) {
    throw new Error(zaloDir + ' khong co tap tin "app.asar".')
  }

  // Backup "app.asar"
  if (!fs.existsSync(appAsarBakPath)) {
    logDebug('- backupFile', appAsarPath)
    fs.createReadStream(appAsarPath).pipe(fs.createWriteStream(appAsarBakPath))
  }

  // Delete "resources/app"
  if (fs.existsSync(appDirPath)) {
    logDebug('- deleteDir', appDirPath)
    await del(appDirPath, { force: true })
  }

  // Extract "resources/app.asar" to "resources/app"
  logDebug('- extractAsar', appAsarPath)
  asar.extractAll(appAsarPath, appDirPath)

  // Copy assets "fonts/*" to "resources/app/pc-dist/zadark/fonts"
  copyAssetDir(zaloDir, {
    src: 'fonts',
    dest: 'pc-dist/zadark/fonts'
  })

  // Copy assets "css/*" to "resources/app/pc-dist/zadark/css"
  copyAssetDir(zaloDir, {
    src: 'css',
    dest: 'pc-dist/zadark/css'
  })

  if (isSyncWithSystem) {
    // Copy assets "zadark-sws.js" to "resources/app/pc-dist/zadark/js"
    copyAssetDir(zaloDir, {
      src: 'js/zadark-sws.js',
      dest: 'pc-dist/zadark/js/zadark-sws.js'
    })
  }

  // Add "themeAttributes, classNames, font, stylesheet" to "resources/app/pc-dist/index.html"
  writeIndexFile(zaloDir, { darkTheme, isSyncWithSystem })

  const darkThemeLabel = {
    dark: 'Dark default',
    dark_dimmed: 'Dark dimmed'
  }

  log(chalk.green(`- Da cai dat "${darkThemeLabel[darkTheme]}".`))

  if (isSyncWithSystem) {
    log(chalk.green('- Da kich hoat "Tu dong thay doi giao dien Zalo theo He dieu hanh".'))
  }
}

const uninstallDarkTheme = async (zaloDir) => {
  const appDirPath = path.join(zaloDir, 'app')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  // Delete "resources/app"
  if (fs.existsSync(appDirPath)) {
    await del(appDirPath, { force: true })
    logDebug('- deleteDir', appDirPath)
  }

  // Delete "resources/app.asar.bak"
  if (fs.existsSync(appAsarBakPath)) {
    await del(appAsarBakPath, { force: true })
    logDebug('- deleteFile', appAsarBakPath)
  }

  log(chalk.green('- Da go cai dat.'))
}

module.exports = {
  getZaloResDirList,

  installDarkTheme,
  uninstallDarkTheme
}
