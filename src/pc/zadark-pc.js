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

const writeIndexFile = (zaloDir, { isSyncWithSystem }) => {
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

  // Required fonts, styles and scripts

  const elements = [
    {
      selector: 'link[href="zadark-fonts.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark-fonts.css">',
      htmlElement: headElement
    },
    {
      selector: 'link[href="zadark.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark.css">',
      htmlElement: headElement
    }
  ]

  if (isSyncWithSystem) {
    elements.push({
      selector: 'script[src="zadark-auto.js"]',
      where: 'beforeend',
      html: '<script src="zadark-auto.js"></script>',
      htmlElement: bodyElement
    })
  }

  elements.forEach(({ selector, where, html, htmlElement }) => {
    const elementExists = root.querySelectorAll(selector)
    if (!elementExists.length) {
      htmlElement.insertAdjacentHTML(where, html)
    }
  })

  // Required themeAttributes
  htmlElement.setAttribute('data-zadark-theme', 'dark')

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

const installDarkTheme = async (zaloDir, isSyncWithSystem = false) => {
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

  // Copy assets "css/*" to "resources/app/pc-dist"
  copyAssetDir(zaloDir, {
    src: 'css',
    dest: 'pc-dist'
  })

  if (isSyncWithSystem) {
    // Copy assets "zadark-auto.js" to "resources/app/pc-dist"
    copyAssetDir(zaloDir, {
      src: 'js/zadark-auto.js',
      dest: 'pc-dist/zadark-auto.js'
    })
  }

  // Add "themeAttributes, classNames, font, stylesheet" to "resources/app/pc-dist/index.html"
  writeIndexFile(zaloDir, { isSyncWithSystem })

  // Create package "resources/app.asar" from "resources/app" -> Delete "resources/app"
  await asar.createPackage(appDirPath, appAsarPath)
  await del(appDirPath, { force: true })

  if (isSyncWithSystem) {
    log(chalk.green('- Da kich hoat giao dien Tu dong thay doi theo He dieu hanh.'))
  } else {
    log(chalk.green('- Da kich hoat giao dien Toi.'))
  }
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

  log(chalk.green('- Da khoi phuc Zalo PC goc.'))
}

module.exports = {
  getZaloResDirList,

  installDarkTheme,
  uninstallDarkTheme
}
