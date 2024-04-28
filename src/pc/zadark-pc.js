const fs = require('fs')
const path = require('path')
const del = require('del')
const asar = require('@electron/asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { printDebug, printError, copyRecursiveAsync } = require('./utils')

const { PLATFORM, IS_MAC, OS_NAME, ZADARK_VERSION, ZADARK_TMP_PATH, ZALO_PROCESS_NAMES, ZADARK_API_DOMAIN } = require('./constants')
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
  try {
    const processes = await psList()

    const pids = processes
      .filter((process) => typeof process.name === 'string' && ZALO_PROCESS_NAMES.includes(process.name.toLowerCase()))
      .map((process) => process.pid)

    return pids
  } catch (error) {
    throw new Error('Vui long tat Zalo PC truoc khi cai dat ZaDark.')
  }
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

const updateMetaContentSecurityPolicyTag = (htmlElement) => {
  const metaTag = htmlElement.querySelector('meta[http-equiv="Content-Security-Policy"]')

  if (!metaTag) {
    printError('- updateContentSecurityPolicy:', 'skip: metaTag not found.')
    return
  }

  let contentValue = metaTag.getAttribute('content')

  if (contentValue.indexOf('https://fonts.googleapis.com') === -1) {
    const regex = /style-src[^;]*/
    contentValue = contentValue.replace(regex, '$& https://fonts.googleapis.com')
  }

  if (contentValue.indexOf(ZADARK_API_DOMAIN) === -1) {
    const regexConnect = /connect-src[^;]*/
    contentValue = contentValue.replace(regexConnect, `$& ${ZADARK_API_DOMAIN}`)
  }

  printDebug('- updateContentSecurityPolicy')
  metaTag.setAttribute('content', contentValue)
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
      selector: 'script[src="zadark-jquery.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-jquery.min.js"></script>',
      htmlElement: bodyElement
    },
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
      selector: 'script[src="zadark-hotkeys-js.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-hotkeys-js.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark-toastify.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-toastify.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark-webfont.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-webfont.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark-introjs.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-introjs.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark-shared.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-shared.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      selector: 'script[src="zadark-translate.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-translate.min.js"></script>',
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

  updateMetaContentSecurityPolicyTag(headElement)

  // Required classNames
  const zaDarkClassNames = ['zadark', 'zadark-pc', `zadark-${PLATFORM}`]
  zaDarkClassNames.forEach((className) => {
    bodyElement.classList.add(className)
  })

  printDebug('- writeFile:', srcPath)
  fs.writeFileSync(srcPath, root.toString())
}

const writeBootstrapFile = (zaloDir) => {
  const src = 'bootstrap.js'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!fs.existsSync(srcPath)) {
    printError('- writeFile:', srcPath, 'skip: file does not exist.')
    return
  }

  const bootstrapContent = fs.readFileSync(srcPath, 'utf8')
  const contentToInsert = "require('./pc-dist/zadark-main.min');"

  if (bootstrapContent.includes(contentToInsert)) {
    printDebug('- writeFile:', srcPath, 'skip: content already exists.')
    return
  }

  const contentToFind = "require('./main-dist/main');"
  const insertionIndex = bootstrapContent.indexOf(contentToFind) + contentToFind.length
  const insertedContent = `${bootstrapContent.slice(0, insertionIndex)}\n    ${contentToInsert}${bootstrapContent.slice(insertionIndex)}`

  printDebug('- writeFile:', srcPath)
  fs.writeFileSync(srcPath, insertedContent)
}

const writeZNotificationFile = (zaloDir) => {
  const src = 'pc-dist/znotification.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!fs.existsSync(srcPath)) {
    printError('- writeFile:', srcPath, 'skip: file does not exist.')
    return
  }

  const indexHTMLContent = fs.readFileSync(srcPath, 'utf8')
  const root = HTMLParser.parse(indexHTMLContent)

  const headElement = root.getElementsByTagName('head')[0]
  const bodyElement = root.getElementsByTagName('body')[0]

  removeZaDarkCSSAndJS({ headElement, bodyElement })

  // Required fonts, stylesheets and scripts
  const elements = [
    {
      selector: 'link[href="zadark-znotification.min.css"]',
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark-znotification.min.css">',
      htmlElement: headElement
    },
    {
      selector: 'script[src="zadark-webfont.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-webfont.min.js"></script>',
      htmlElement: bodyElement
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

  printDebug('- writeFile:', srcPath)
  fs.writeFileSync(srcPath, root.toString())
}

const copyAssetDir = async (zaloDir, { dest, src }) => {
  const srcPath = path.join(__dirname, `./assets/${src}`)
  const destPath = path.join(zaloDir, `app/${dest}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' khong ton tai.')
  }

  printDebug('- copyDir:', src, '>', destPath)
  await copyRecursiveAsync(srcPath, destPath)
}

const copyAssets = async () => {
  // Copy assets
  const assets = [
    {
      // "pc/assets/fonts/*" to "ZADARK_TMP_PATH/app/pc-dist/fonts"
      src: 'fonts',
      dest: 'pc-dist/fonts'
    },
    {
      // "pc/assets/images/*" to "ZADARK_TMP_PATH/app/pc-dist"
      src: 'images',
      dest: 'pc-dist'
    },
    {
      // "pc/assets/css/*" to "ZADARK_TMP_PATH/app/pc-dist"
      src: 'css',
      dest: 'pc-dist'
    },
    {
      // "pc/assets/js/*" to "ZADARK_TMP_PATH/app/pc-dist"
      src: 'js',
      dest: 'pc-dist'
    },
    {
      // "pc/assets/libs/*" to "ZADARK_TMP_PATH/app/pc-dist"
      src: 'libs',
      dest: 'pc-dist'
    }
  ]

  for (const asset of assets) {
    await copyAssetDir(ZADARK_TMP_PATH, asset)
  }
}

const installZaDark = async (zaloDir) => {
  if (!fs.existsSync(zaloDir)) {
    throw new Error(zaloDir + ' khong ton tai.')
  }

  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  const appDirTmpPath = path.join(ZADARK_TMP_PATH, 'app')
  const appAsarTmpPath = path.join(ZADARK_TMP_PATH, 'app.asar')

  if (!fs.existsSync(appAsarPath)) {
    throw new Error(zaloDir + ' khong co tap tin "app.asar".')
  }

  // Delete ZADARK_TMP_PATH
  if (fs.existsSync(ZADARK_TMP_PATH)) {
    printDebug('- deleteDir:', ZADARK_TMP_PATH)
    await del(ZADARK_TMP_PATH, { force: true })
  }

  printDebug('- createDir:', ZADARK_TMP_PATH)
  fs.mkdirSync(ZADARK_TMP_PATH)

  // Extract "resources/app.asar" to "ZADARK_TMP_PATH/app"
  printDebug('- extractAsar:', appAsarPath, '>', appDirTmpPath)
  asar.extractAll(appAsarPath, appDirTmpPath)

  // Copy assets
  await copyAssets()

  const writeFilePromises = [
    // Add "themeAttributes, classNames, fonts, stylesheets and scripts" to "ZADARK_TMP_PATH/app/pc-dist/index.html"
    writeIndexFile(ZADARK_TMP_PATH),

    // Add zadark-main to "ZADARK_TMP_PATH/app/bootstrap.js"
    writeBootstrapFile(ZADARK_TMP_PATH)
  ]

  if (!IS_MAC) {
    // Add fonts, stylesheets and scripts" to "ZADARK_TMP_PATH/app/pc-dist/znotification.html"
    writeFilePromises.push(
      writeZNotificationFile(ZADARK_TMP_PATH)
    )
  }

  await Promise.all(writeFilePromises)

  // Create package "ZADARK_TMP_PATH/app.asar" from "ZADARK_TMP_PATH/app"
  printDebug('- createAsar:', appDirTmpPath, '>', appAsarTmpPath)
  await asar.createPackage(appDirTmpPath, appAsarTmpPath)

  // Rename "resources/app.asar" to "resources/app.asar.bak"
  if (!fs.existsSync(appAsarBakPath)) {
    printDebug('- renameFile:', appAsarPath, '>', appAsarBakPath)
    fs.renameSync(appAsarPath, appAsarBakPath)
  }

  // Copy "ZADARK_TMP_PATH/app.asar" to "resources/app.asar"
  printDebug('- copyFile:', appAsarTmpPath, '>', appAsarPath)
  fs.copyFileSync(appAsarTmpPath, appAsarPath)

  // Delete "ZADARK_TMP_PATH"
  printDebug('- deleteDir:', ZADARK_TMP_PATH)
  await del(ZADARK_TMP_PATH, { force: true })
}

const uninstallZaDark = async (zaloDir) => {
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (!fs.existsSync(appAsarBakPath)) {
    throw new Error('Go cai dat ZaDark khong thanh cong.')
  }

  // Rename "resources/app.asar.bak" to "resources/app.asar"
  printDebug('- renameFile:', appAsarBakPath, '>', appAsarPath)
  fs.renameSync(appAsarBakPath, appAsarPath)
}

module.exports = {
  getZaloResDirList,
  getZaloProcessIds,

  installZaDark,
  uninstallZaDark
}
