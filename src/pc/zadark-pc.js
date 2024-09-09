const fs = require('fs-extra')
const path = require('path')
const asar = require('@electron/asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { printDebug, printError, copyRecursiveAsync, copyDirectory, isDirectory, isFile } = require('./utils')

const { PLATFORM, IS_MAC, OS_NAME, ZADARK_VERSION, ZADARK_TMP_PATH, ZALO_PROCESS_NAMES, ZADARK_API_DOMAIN } = require('./constants')

const psList = require('./packages/ps-list')

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

  return resources.sort()
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
 * This function searches for `<link>` elements in the `headElement` and `<script>` elements in the
 * `bodyElement` whose `href` or `src` attributes start with "zadark", and removes them from the DOM.
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
 * This function searches for a `<meta>` tag with the `http-equiv="Content-Security-Policy"` attribute
 * in the specified `htmlElement`. If the meta tag is found, it updates its `content` attribute by:
 * - Adding `https://fonts.googleapis.com` to the `style-src` directive if it's not already present.
 * - Adding `ZADARK_API_DOMAIN` to the `connect-src` directive if it's not already present.
 *
 * If the meta tag is not found, the function logs an error message and skips the update.
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
 * The function performs the following tasks:
 * 1. Verifies the existence of the `index.html` file in the `zaloDir`.
 * 2. Parses the HTML and removes existing ZaDark-related CSS and JS files.
 * 3. Adds the required CSS and JS files to the `<head>` and `<body>` elements.
 * 4. Updates the Content-Security-Policy meta tag with necessary sources.
 * 5. Adds required data attributes and class names to the `<html>` and `<body>` elements.
 * 6. Saves the modified HTML content back to the original file.
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
      selector: 'script[src="zadark-localforage.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-localforage.min.js"></script>',
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

/**
 * Modifies the `bootstrap.js` file located in the specified Zalo directory by inserting a
 * required `zadark-main.min` module if it doesn't already exist.
 *
 * The function performs the following tasks:
 * 1. Verifies the existence of the `bootstrap.js` file in the `zaloDir`.
 * 2. Checks if the `zadark-main.min` module is already required in the file.
 * 3. If not, inserts the require statement after the `main-dist/main` module.
 * 4. Saves the modified content back to the original file.
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

/**
 * Modifies the `znotification.html` file located in the specified Zalo directory by adding necessary
 * CSS, JavaScript files, and class names required for the ZaDark theme.
 *
 * The function performs the following tasks:
 * 1. Verifies the existence of the `znotification.html` file in the `zaloDir`.
 * 2. Parses the HTML and removes existing ZaDark-related CSS and JS files.
 * 3. Adds the required CSS and JS files to the `<head>` and `<body>` elements.
 * 4. Adds required class names to the `<body>` element.
 * 5. Saves the modified HTML content back to the original file.
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
      selector: 'script[src="zadark-popup-viewer.min.js"]',
      where: 'beforeend',
      html: '<script src="zadark-popup-viewer.min.js"></script>',
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
 * Asynchronously copies the contents of a source asset directory to a destination directory within the specified Zalo directory.
 *
 * The function performs the following tasks:
 * 1. Verifies the existence of the source asset directory.
 * 2. Copies the contents of the source directory to the destination directory.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located. This is the base path for the destination directory.
 * @param {Object} options - Options for the source and destination paths.
 * @param {string} options.dest - The relative path of the destination directory within the Zalo application directory.
 * @param {string} options.src - The relative path of the source asset directory to be copied.
 *
 * @throws {Error} If the source asset directory does not exist.
 *
 * @returns {Promise<void>} A promise that resolves when the copying process is complete.
 */
const copyAssetDir = async (zaloDir, { dest, src }) => {
  const srcPath = path.join(__dirname, `./assets/${src}`)
  const destPath = path.join(zaloDir, `app/${dest}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' khong ton tai (E004).')
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

/**
 * Installs ZaDark by updating the `app.asar` file in the specified Zalo directory with the ZaDark theme.
 *
 * The function performs the following tasks:
 * 1. Verifies that the given directory exists and is valid.
 * 2. Deletes the existing `app.asar` file if it is a directory and the temporary directory `ZADARK_TMP_PATH` if it exists.
 * 3. Creates a new temporary directory `ZADARK_TMP_PATH` and extracts the `app.asar` file into it.
 * 4. Copies necessary assets and modifies specific files (`index.html`, `bootstrap.js`, and optionally `znotification.html`) within the extracted content.
 * 5. Renames the original `app.asar` file to `app.asar.bak` if it does not already exist.
 * 6. Replaces the `app.asar` file with the updated content from the temporary directory.
 * 7. Cleans up by deleting the temporary directory `ZADARK_TMP_PATH`.
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

  // Delete dir "ZADARK_TMP_PATH"
  if (fs.existsSync(ZADARK_TMP_PATH)) {
    printDebug('- deleteDir:', ZADARK_TMP_PATH)
    fs.rmSync(ZADARK_TMP_PATH, { recursive: true })
  }

  // Delete dir "resources/app.asar"
  if (isDirectory(appAsarPath)) {
    printDebug('- deleteDir:', appAsarPath)
    fs.rmSync(appAsarPath, { recursive: true })
  }

  // Rename file "resources/app.asar.bak" to "resources/app.asar"
  if (!isFile(appAsarPath) && isFile(appAsarBakPath)) {
    printDebug('- renameFile:', appAsarBakPath, '>', appAsarPath)
    fs.renameSync(appAsarBakPath, appAsarPath)
  }

  // Create dir "ZADARK_TMP_PATH"
  printDebug('- createDir:', ZADARK_TMP_PATH)
  fs.mkdirSync(ZADARK_TMP_PATH, { recursive: true })

  // Extract file "resources/app.asar" to dir "ZADARK_TMP_PATH/app"
  printDebug('- extractAsar:', appAsarPath, '>', appDirTmpPath)
  asar.extractAll(appAsarPath, appDirTmpPath)

  await copyAssets()

  const writeFilePromises = [
    // Inject "themeAttributes, classNames, fonts, stylesheets and scripts" to file "ZADARK_TMP_PATH/app/pc-dist/index.html"
    writeIndexFile(ZADARK_TMP_PATH),

    // Inject zadark-main to file "ZADARK_TMP_PATH/app/bootstrap.js"
    writeBootstrapFile(ZADARK_TMP_PATH),

    // Inject scripts to "ZADARK_TMP_PATH/app/pc-dist/popup-viewer.html"
    writePopupViewerFile(ZADARK_TMP_PATH)
  ]

  if (!IS_MAC) {
    // Inject "stylesheets and scripts" to "ZADARK_TMP_PATH/app/pc-dist/znotification.html"
    writeFilePromises.push(
      writeZNotificationFile(ZADARK_TMP_PATH)
    )
  }

  await Promise.all(writeFilePromises)

  // Rename file "resources/app.asar" to "resources/app.asar.bak"
  if (!isFile(appAsarBakPath)) {
    printDebug('- renameFile:', appAsarPath, '>', appAsarBakPath)
    fs.renameSync(appAsarPath, appAsarBakPath)
  }

  // Copy dir "ZADARK_TMP_PATH/app" to dir "resources/app.asar"
  printDebug('- copyDir:', appDirTmpPath, '>', appAsarPath)
  copyDirectory(appDirTmpPath, appAsarPath)

  // Delete dir "ZADARK_TMP_PATH"
  printDebug('- deleteDir:', ZADARK_TMP_PATH)
  fs.rmSync(ZADARK_TMP_PATH, { recursive: true })
}

/**
 * Uninstalls ZaDark by restoring the original `app.asar` file in the specified Zalo directory.
 *
 * The function performs the following tasks:
 * 1. Verifies the existence of the backup `app.asar.bak` file.
 * 2. Deletes the existing `app.asar` directory if it is a directory.
 * 3. Renames the backup file `app.asar.bak` to `app.asar` to restore the original state.
 *
 * @param {string} zaloDir - The directory where the Zalo application is located.
 *
 * @throws {Error} If the backup file `app.asar.bak` does not exist, indicating that ZaDark installation was not successful.
 *
 * @returns {Promise<void>} A promise that resolves when the uninstallation process is complete.
 */
const uninstallZaDark = async (zaloDir) => {
  const appDirPath = path.join(zaloDir, 'app')
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (!isFile(appAsarBakPath)) {
    throw new Error('Go cai dat ZaDark khong thanh cong (E003).')
  }

  // Delete dir "resources/app.asar"
  if (isDirectory(appAsarPath)) {
    printDebug('- deleteDir:', appDirPath)
    fs.rmSync(appAsarPath, { recursive: true })
  }

  // Rename file "resources/app.asar.bak" to "resources/app.asar"
  printDebug('- renameFile:', appAsarBakPath, '>', appAsarPath)
  fs.renameSync(appAsarBakPath, appAsarPath)
}

module.exports = {
  getZaloResDirList,
  getZaloProcessIds,

  installZaDark,
  uninstallZaDark
}
