/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

const fs = require('fs')
const path = require('path')
const del = require('del')
const chalk = require('chalk')
const asar = require('asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { log, logDebug, copyRecursiveSync } = require('./utils')
const { PLATFORM, ZADARK_VERSION } = require('./constants')

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

const writeIndexFile = (zaloDir) => {
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

  // Required fonts
  const zadarkFonts = root.querySelectorAll('link[href="zadark-fonts.min.css"]')
  if (!zadarkFonts.length) {
    headElement.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="zadark-fonts.min.css">'
    )
  }

  // Required stylesheets

  const zadarkCSS = root.querySelectorAll('link[href="zadark.min.css"]')
  if (!zadarkCSS.length) {
    headElement.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="zadark.min.css">'
    )
  }

  const zadarkPopupCSS = root.querySelectorAll('link[href="zadark-popup.min.css"]')
  if (!zadarkPopupCSS.length) {
    headElement.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="zadark-popup.min.css">'
    )
  }

  // Required scripts

  const zadarkJQueryScript = root.querySelectorAll('script[src="zadark-jquery.min.js"]')
  if (!zadarkJQueryScript.length) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      '<script src="zadark-jquery.min.js"></script>'
    )
  }

  const zadarkPopperScript = root.querySelectorAll('script[src="zadark-popper.min.js"]')
  if (!zadarkPopperScript.length) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      '<script src="zadark-popper.min.js"></script>'
    )
  }

  // Required script
  const zadarkScript = root.querySelectorAll('script[src="zadark.min.js"]')
  if (!zadarkScript.length) {
    bodyElement.insertAdjacentHTML(
      'beforeend',
      '<script src="zadark.min.js"></script>'
    )
  }

  // Required themeAttributes
  htmlElement.setAttribute('data-zadark-version', ZADARK_VERSION)

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
    throw new Error(srcPath + ' khong ton tai.')
  }

  copyRecursiveSync(srcPath, destPath)

  logDebug('- copyAssetDir', src, '➜', destPath)
}

const installDarkTheme = async (zaloDir) => {
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

  // Copy assets "fonts/*" to "resources/app/pc-dist/fonts"
  copyAssetDir(zaloDir, {
    src: 'fonts',
    dest: 'pc-dist/fonts'
  })

  // Copy assets "images/*" to "resources/app/pc-dist"
  copyAssetDir(zaloDir, {
    src: 'images',
    dest: 'pc-dist'
  })

  // Copy assets "css/*" to "resources/app/pc-dist"
  copyAssetDir(zaloDir, {
    src: 'css',
    dest: 'pc-dist'
  })

  // Copy assets "js/*" to "resources/app/pc-dist"
  copyAssetDir(zaloDir, {
    src: 'js',
    dest: 'pc-dist'
  })

  // Copy assets "libs/*" to "resources/app/pc-dist"
  copyAssetDir(zaloDir, {
    src: 'libs',
    dest: 'pc-dist'
  })

  // Add "themeAttributes, classNames, font, stylesheet" to "resources/app/pc-dist/index.html"
  writeIndexFile(zaloDir)

  // Create package "resources/app.asar" from "resources/app" -> Delete "resources/app"
  await asar.createPackage(appDirPath, appAsarPath)
  await del(appDirPath, { force: true })
}

const uninstallDarkTheme = async (zaloDir) => {
  const appDirPath = path.join(zaloDir, 'app')
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  // Delete "resources/app"
  if (fs.existsSync(appDirPath)) {
    await del(appDirPath, { force: true })
    logDebug('- deleteDir', appDirPath)
  }

  // Rename "resources/app.asar.bak" to "resources/app.asar"
  if (fs.existsSync(appAsarBakPath)) {
    fs.renameSync(appAsarBakPath, appAsarPath)
    logDebug('- renameFile', appAsarBakPath)
  }

  log(chalk.green('- Da go cai dat ZaDark.'))
}

module.exports = {
  getZaloResDirList,

  installDarkTheme,
  uninstallDarkTheme
}
