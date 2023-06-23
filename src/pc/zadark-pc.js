const fs = require('fs')
const path = require('path')
const del = require('del')
const asar = require('@electron/asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { printDebug, copyRecursiveSync } = require('./utils')

const { PLATFORM, ZADARK_VERSION, IS_MAC, OS_NAME } = require('./constants')
const psList = require('./packages/ps-list')

const getZaloResDirList = (customZaloPath) => {
  if (!['darwin', 'win32'].includes(PLATFORM)) {
    throw new Error(`Khong ho tro he dieu hanh "${PLATFORM}".`)
  }

  const resourcesPath = IS_MAC
    ? path.join(customZaloPath, './Contents/Resources')
    : path.join(customZaloPath, './Zalo-*/resources')

  const resources = glob.sync(resourcesPath)

  if (!Array.isArray(resources) || !resources.length) {
    return []
  }

  return resources.sort()
}

const getZaloProcessIds = async () => {
  const processes = await psList()

  const processName = IS_MAC
    ? ['zalo', '/applications/za']
    : ['zalo.exe']

  const pids = processes
    .filter((process) => processName.includes(process.name.toLowerCase()))
    .map((process) => process.pid)

  return pids
}

const removeZaDarkCSSAndJS = ({ headElement, bodyElement }) => {
  const elementsToRemove = [
    {
      selector: 'link[href^="zadark"]',
      htmlElement: headElement
    },
    {
      selector: 'script[src^="zadark"]',
      htmlElement: bodyElement
    }
  ]

  elementsToRemove.forEach(({ selector, htmlElement }) => {
    const elements = htmlElement.querySelectorAll(selector)
    elements.forEach((element) => {
      element.remove()
    })
  })
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

  removeZaDarkCSSAndJS({ headElement, bodyElement })

  // Required fonts, stylesheets and scripts
  const elements = [
    // Required fonts
    {
      selector: 'link[href="zadark-fonts.min.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark-fonts.min.css">',
      htmlElement: headElement
    },
    // Required stylesheets
    {
      selector: 'link[href="zadark.min.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark.min.css">',
      htmlElement: headElement
    },
    {
      selector: 'link[href="zadark-popup.min.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark-popup.min.css">',
      htmlElement: headElement
    },
    // Required scripts
    {
      selector: 'script[src="zadark-popper.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-popper.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark-tippy.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-tippy.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark.min.js"></script>',
      htmlElement: bodyElement
    }
  ]

  // Insert new elements
  elements.forEach((element) => {
    const { selector, where, html, htmlElement } = element
    const elementExists = root.querySelectorAll(selector)
    if (!elementExists.length) {
      htmlElement.insertAdjacentHTML(where, html)
    }
  })

  // Required themeAttributes
  htmlElement.setAttribute('data-zadark-version', ZADARK_VERSION)
  htmlElement.setAttribute('data-zadark-os', OS_NAME)

  // Required classNames
  const zaDarkClassNames = ['zadark', 'zadark-pc', `zadark-${PLATFORM}`]
  zaDarkClassNames.forEach((className) => {
    bodyElement.classList.add(className)
  })

  fs.writeFileSync(srcPath, root.toString())
  printDebug('- writeIndexFile', srcPath)
}

const writeBootstrapFile = (zaloDir) => {
  const src = 'bootstrap.js'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' khong ton tai.')
  }

  const bootstrapContent = fs.readFileSync(srcPath, 'utf8')
  const contentToInsert = "require('./pc-dist/zadark-main.min');"

  if (bootstrapContent.includes(contentToInsert)) {
    printDebug('- writeBootstrapFile', 'skip: contentToInsert already exists.')
    return
  }

  const contentToFind = "require('./main-dist/main');"
  const insertionIndex = bootstrapContent.indexOf(contentToFind) + contentToFind.length
  const insertedContent = `${bootstrapContent.slice(0, insertionIndex)}\n    ${contentToInsert}${bootstrapContent.slice(insertionIndex)}`

  fs.writeFileSync(srcPath, insertedContent)
  printDebug('- writeBootstrapFile', srcPath)
}

const writeZNotificationFile = (zaloDir) => {
  const src = 'pc-dist/znotification.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' khong ton tai.')
  }

  const indexHTMLContent = fs.readFileSync(srcPath, 'utf8')
  const root = HTMLParser.parse(indexHTMLContent)

  const headElement = root.getElementsByTagName('head')[0]
  const bodyElement = root.getElementsByTagName('body')[0]

  removeZaDarkCSSAndJS({ headElement, bodyElement })

  // Required fonts, stylesheets and scripts
  const elements = [
    {
      selector: 'link[href="zadark-fonts.min.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark-fonts.min.css">',
      htmlElement: headElement
    },
    {
      selector: 'link[href="zadark-znotification.min.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark-znotification.min.css">',
      htmlElement: headElement
    },
    {
      selector: 'script[src="zadark-znotification.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-znotification.min.js"></script>',
      htmlElement: bodyElement
    }
  ]
  elements.forEach((element) => {
    const { selector, where, html, htmlElement } = element
    const elementExists = root.querySelectorAll(selector)
    if (!elementExists.length) {
      htmlElement.insertAdjacentHTML(where, html)
    }
  })

  // Required classNames
  const zaDarkClassNames = ['zadark', 'zadark-pc', `zadark-${PLATFORM}`]
  zaDarkClassNames.forEach((className) => {
    bodyElement.classList.add(className)
  })

  fs.writeFileSync(srcPath, root.toString())
  printDebug('- writeZNotificationFile', srcPath)
}

const copyAssetDir = (zaloDir, { dest, src }) => {
  const srcPath = path.join(__dirname, `./assets/${src}`)
  const destPath = path.join(zaloDir, `app/${dest}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' khong ton tai.')
  }

  copyRecursiveSync(srcPath, destPath)

  printDebug('- copyAssetDir', src, '➜', destPath)
}

const installZaDark = async (zaloDir) => {
  if (!fs.existsSync(zaloDir)) {
    throw new Error(zaloDir + ' khong ton tai.')
  }

  const appDirPath = path.join(zaloDir, 'app')
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (!fs.existsSync(appAsarPath)) {
    throw new Error(zaloDir + ' khong co tap tin "app.asar".')
  }

  // Delete "resources/app"
  if (fs.existsSync(appDirPath)) {
    printDebug('- deleteDir', appDirPath)
    await del(appDirPath, { force: true })
  }

  // Extract "resources/app.asar" to "resources/app"
  printDebug('- extractAsar', appAsarPath)
  asar.extractAll(appAsarPath, appDirPath)

  // Backup "app.asar"
  // Rename "resources/app.asar" to "resources/app.asar.bak"
  if (!fs.existsSync(appAsarBakPath)) {
    printDebug('- backupFile', appAsarPath)
    fs.renameSync(appAsarPath, appAsarBakPath)
  }

  // Copy assets
  const assets = [
    {
      // "pc/assets/fonts/*" to "resources/app/pc-dist/fonts"
      src: 'fonts',
      dest: 'pc-dist/fonts'
    },
    {
      // "pc/assets/images/*" to "resources/app/pc-dist"
      src: 'images',
      dest: 'pc-dist'
    },
    {
      // "pc/assets/css/*" to "resources/app/pc-dist"
      src: 'css',
      dest: 'pc-dist'
    },
    {
      // "pc/assets/js/*" to "resources/app/pc-dist"
      src: 'js',
      dest: 'pc-dist'
    },
    {
      // "pc/assets/libs/*" to "resources/app/pc-dist"
      src: 'libs',
      dest: 'pc-dist'
    }
  ]
  assets.forEach((asset) => {
    copyAssetDir(zaloDir, asset)
  })

  // Add "themeAttributes, classNames, fonts, stylesheets and scripts" to "resources/app/pc-dist/index.html"
  writeIndexFile(zaloDir)

  // Add zadark-main to "resources/app/bootstrap.js"
  writeBootstrapFile(zaloDir)

  if (!IS_MAC) {
    // Add fonts, stylesheets and scripts" to "resources/app/pc-dist/znotification.html"
    writeZNotificationFile(zaloDir)
  }

  // Create package "resources/app.asar" from "resources/app" -> Delete "resources/app"
  await asar.createPackage(appDirPath, appAsarPath)
  await del(appDirPath, { force: true })
}

const uninstallZaDark = async (zaloDir) => {
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  // Delete "resources/app.asar"
  // Rename "resources/app.asar.bak" to "resources/app.asar"
  if (fs.existsSync(appAsarBakPath)) {
    printDebug('- deleteFile', appAsarPath)
    await del(appAsarPath, { force: true })
    fs.renameSync(appAsarBakPath, appAsarPath)
    printDebug('- renameFile', appAsarBakPath)
  }
}

module.exports = {
  getZaloResDirList,
  getZaloProcessIds,

  installZaDark,
  uninstallZaDark
}
