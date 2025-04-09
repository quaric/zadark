const fs = require('fs-extra')
const path = require('path')
const asar = require('@electron/asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { printDebug, printError, isDirectory, isFile } = require('./utils')

const { PLATFORM, IS_MAC, IS_WIN, OS_NAME, ZADARK_VERSION, ZADARK_TMP_PATH, ZALO_PROCESS_NAMES, ZADARK_API_DOMAIN } = require('./constants')

const psList = require('./packages/ps-list')

const getVersionFromPath = (str) => {
  const match = str.match(/Zalo-(\d+\.\d+\.\d+)/)
  return match ? match[1] : '0.0.0'
}

const parseVersion = (version) => version.split('.').map(Number)

const compareVersionPaths = (pathA, pathB) => {
  const versionA = parseVersion(getVersionFromPath(pathA))
  const versionB = parseVersion(getVersionFromPath(pathB))

  for (let i = 0; i < 3; i++) {
    if (versionA[i] !== versionB[i]) {
      return versionA[i] - versionB[i]
    }
  }

  return 0
}

/**
 * Get Zalo resources directory list
 * @param {string} customZaloPath - The custom Zalo path
 * @returns {string[]} - The Zalo resources directory list
 * @throws {Error} - Throws error if the platform is not supported
 * @throws {Error} - Throws error if the resources directory list is empty
 */
const getZaloResDirList = (customZaloPath) => {
  if (!['darwin', 'win32'].includes(PLATFORM)) {
    throw new Error(`Khong ho tro he dieu hanh "${PLATFORM}" (E006).`)
  }

  const resourcesPath = IS_MAC
    ? path.join(customZaloPath, './Contents/Resources')
    : path.join(customZaloPath, './Zalo-*/resources')

  const resources = glob.sync(resourcesPath)

  if (!Array.isArray(resources) || !resources.length) {
    return []
  }

  return resources.sort(compareVersionPaths)
}

/**
 * Get Zalo process IDs
 * @returns {Promise<number[]>} - The Zalo process IDs
 * @throws {Error} - Throws error if the Zalo process names are not found
 */
const getZaloProcessIds = async () => {
  try {
    const processes = await psList()

    const pids = processes
      .filter((process) => typeof process.name === 'string' && ZALO_PROCESS_NAMES.includes(process.name.toLowerCase()))
      .map((process) => process.pid)

    return pids
  } catch (error) {
    throw new Error('Vui long tat Zalo PC truoc khi cai dat ZaDark (E007).')
  }
}

/**
 * Removes all CSS and JavaScript files from the document that have filenames starting with "zadark".
 *
 * @param {Object} params - The parameters for the function.
 * @param {HTMLElement} params.headElement - The `<head>` element of the document, used to search for `<link>` elements.
 * @param {HTMLElement} params.bodyElement - The `<body>` element of the document, used to search for `<script>` elements.
 */
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

/**
 * Updates the Content-Security-Policy (CSP) meta tag in the provided HTML element.
 *
 * @param {HTMLElement} htmlElement - The HTML element to search for the Content-Security-Policy meta tag.
 *
 * @throws Will throw an error if `ZADARK_API_DOMAIN` is not defined in the scope.
 */
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

/**
 * Modifies the `index.html` file located in the specified Zalo directory by adding necessary CSS,
 * JavaScript files, and attributes required for the ZaDark theme.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *                           This is the base path for the `index.html` file.
 *
 * @throws {Error} If the `index.html` file does not exist at the expected path.
 */
const writeIndexFile = (zaloDir) => {
  const src = 'pc-dist/index.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!isFile(srcPath)) {
    throw new Error(srcPath + ' khong ton tai (E005).')
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
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark/css/zadark-fonts.min.css">',
      htmlElement: headElement
    },
    // Required stylesheets
    {
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark/css/zadark.min.css">',
      htmlElement: headElement
    },
    {
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark/css/zadark-popup.min.css">',
      htmlElement: headElement
    },
    // Required scripts
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-jquery.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-popper.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-tippy.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-hotkeys-js.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-toastify.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-webfont.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-introjs.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-localforage.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark-shared.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark-translate.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark-zconv.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark-reaction.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark.min.js"></script>',
      htmlElement: bodyElement
    }
  ]
  elements.forEach((element) => {
    const { where, html, htmlElement } = element
    htmlElement.insertAdjacentHTML(where, html)
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

/**
 * Modifies the `bootstrap.js` file located in the specified Zalo directory by inserting a
 * required `zadark-main.min` module if it doesn't already exist.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *                           This is the base path for the `bootstrap.js` file.
 */
const writeBootstrapFile = (zaloDir) => {
  const src = 'bootstrap.js'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!isFile(srcPath)) {
    printError('- writeFile:', srcPath, 'skip: file does not exist.')
    return
  }

  const bootstrapContent = fs.readFileSync(srcPath, 'utf8')
  const contentToInsert = "require('./pc-dist/zadark/js/zadark-main.min');"

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

/**
 * Modifies the `znotification.html` file located in the specified Zalo directory by adding necessary
 * CSS, JavaScript files, and class names required for the ZaDark theme.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *                           This is the base path for the `znotification.html` file.
 */
const writeZNotificationFile = (zaloDir) => {
  const src = 'pc-dist/znotification.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!isFile(srcPath)) {
    printError('- writeFile:', srcPath, 'skip: file does not exist.')
    return
  }

  const htmlContent = fs.readFileSync(srcPath, 'utf8')
  const root = HTMLParser.parse(htmlContent)

  const headElement = root.getElementsByTagName('head')[0]
  const bodyElement = root.getElementsByTagName('body')[0]

  removeZaDarkCSSAndJS({ headElement, bodyElement })

  // Required stylesheets and scripts
  const elements = [
    {
      where: 'beforeend',
      html: '<link rel="stylesheet" href="zadark/css/zadark-znotification.min.css">',
      htmlElement: headElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/libs/zadark-webfont.min.js"></script>',
      htmlElement: bodyElement
    },
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark-znotification.min.js"></script>',
      htmlElement: bodyElement
    }
  ]
  elements.forEach((element) => {
    const { where, html, htmlElement } = element
    htmlElement.insertAdjacentHTML(where, html)
  })

  // Required classNames
  const zaDarkClassNames = ['zadark', 'zadark-pc', `zadark-${PLATFORM}`]
  zaDarkClassNames.forEach((className) => {
    bodyElement.classList.add(className)
  })

  printDebug('- writeFile:', srcPath)
  fs.writeFileSync(srcPath, root.toString())
}

/**
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *                           This is the base path for the `popup-viewer.html` file.
 */
const writePopupViewerFile = (zaloDir) => {
  const src = 'pc-dist/popup-viewer.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!isFile(srcPath)) {
    printError('- writeFile:', srcPath, 'skip: file does not exist.')
    return
  }

  const htmlContent = fs.readFileSync(srcPath, 'utf8')
  const root = HTMLParser.parse(htmlContent)

  const headElement = root.getElementsByTagName('head')[0]
  const bodyElement = root.getElementsByTagName('body')[0]

  removeZaDarkCSSAndJS({ headElement, bodyElement })

  // Required scripts
  const elements = [
    {
      where: 'beforeend',
      html: '<script src="zadark/js/zadark-popup-viewer.min.js"></script>',
      htmlElement: bodyElement
    }
  ]
  elements.forEach((element) => {
    const { where, html, htmlElement } = element
    htmlElement.insertAdjacentHTML(where, html)
  })

  updateMetaContentSecurityPolicyTag(headElement)

  // Required classNames
  const zaDarkClassNames = ['zadark', 'zadark-pc', `zadark-${PLATFORM}`]
  zaDarkClassNames.forEach((className) => {
    bodyElement.classList.add(className)
  })

  printDebug('- writeFile:', srcPath)
  fs.writeFileSync(srcPath, root.toString())
}

/**
  * Copies the ZaDark assets to the specified Zalo directory.
  * @param {string} zaloDir - The directory where the Zalo application is located.
 */
const copyZaDarkAssets = (zaloDir) => {
  const src = path.join(__dirname, './assets')
  const dest = path.join(zaloDir, 'app/pc-dist/zadark')
  printDebug('- copyDir:', src, '>', dest)
  fs.copySync(src, dest)
}

/**
 * Installs ZaDark by updating the `app.asar` file in the specified Zalo directory with the ZaDark theme.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *
 * @throws {Error} If the specified directory does not exist or if required files are missing.
 *
 * @returns {Promise<void>} A promise that resolves when the installation process is complete.
 */
const installZaDark = async (zaloDir) => {
  if (!isDirectory(zaloDir)) {
    throw new Error(zaloDir + ' khong ton tai (E001).')
  }

  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')
  const appDirTmpPath = path.join(ZADARK_TMP_PATH, 'app')

  if (!isFile(appAsarPath) && !isFile(appAsarBakPath)) {
    throw new Error(zaloDir + ' khong co tap tin "app.asar" hoac "app.asar.bak" (E002).')
  }

  if (fs.existsSync(ZADARK_TMP_PATH)) {
    printDebug('- deleteDir:', ZADARK_TMP_PATH)
    fs.rmSync(ZADARK_TMP_PATH, { recursive: true })
  }

  if (isDirectory(appAsarPath)) {
    printDebug('- deleteDir:', appAsarPath)
    fs.rmSync(appAsarPath, { recursive: true })
  }

  if (isFile(appAsarPath) && isFile(appAsarBakPath)) {
    printDebug('- deleteFile:', appAsarPath)
    fs.rmSync(appAsarPath, { recursive: true })

    printDebug('- renameFile:', appAsarBakPath, '>', appAsarPath)
    fs.renameSync(appAsarBakPath, appAsarPath)
  }

  printDebug('- createDir:', ZADARK_TMP_PATH)
  fs.mkdirSync(ZADARK_TMP_PATH, { recursive: true })

  printDebug('- extractAsar:', appAsarPath, '>', appDirTmpPath)
  asar.uncacheAll()
  asar.extractAll(appAsarPath, appDirTmpPath)

  copyZaDarkAssets(ZADARK_TMP_PATH)
  writeIndexFile(ZADARK_TMP_PATH)
  writeBootstrapFile(ZADARK_TMP_PATH)
  writePopupViewerFile(ZADARK_TMP_PATH)

  if (IS_WIN) {
    writeZNotificationFile(ZADARK_TMP_PATH)
  }

  if (!isFile(appAsarBakPath)) {
    printDebug('- renameFile:', appAsarPath, '>', appAsarBakPath)
    fs.renameSync(appAsarPath, appAsarBakPath)
  }

  printDebug('- createAsar:', appDirTmpPath, '>', appAsarPath)
  await asar.createPackage(appDirTmpPath, appAsarPath)

  printDebug('- deleteDir:', ZADARK_TMP_PATH)
  fs.rmSync(ZADARK_TMP_PATH, { recursive: true })
}

/**
 * Uninstalls ZaDark by restoring the original `app.asar` file in the specified Zalo directory.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *
 * @throws {Error} If the backup file `app.asar.bak` does not exist, indicating that ZaDark installation was not successful.
 *
 * @returns {Promise<void>} A promise that resolves when the uninstallation process is complete.
 */
const uninstallZaDark = (zaloDir) => {
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (!isFile(appAsarBakPath)) {
    throw new Error('Go cai dat ZaDark khong thanh cong. Vui long cai lai Zalo PC (KHONG DUOC GO ZALO PC vi se mat du lieu).')
  }

  if (fs.existsSync(appAsarPath)) {
    fs.rmSync(appAsarPath, { recursive: true })
  }

  printDebug('- renameFile:', appAsarBakPath, '>', appAsarPath)
  fs.renameSync(appAsarBakPath, appAsarPath)
}

module.exports = {
  getZaloResDirList,
  getZaloProcessIds,

  installZaDark,
  uninstallZaDark
}
