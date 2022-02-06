/*
  Za Dark – Best Dark Theme for Zalo
  Made by NCDAi
*/

const fs = require('fs')
const os = require('os')
const path = require('path')
const del = require('del')
const chalk = require('chalk')
const asar = require('asar')
const HTMLParser = require('node-html-parser')
const glob = require('glob')

const { log, logDebug } = require('../../utils')

const platform = os.platform()

const getLastElOfArray = (arr) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr[arr.length - 1]
  }
  return null
}

const getDefaultZaloResDir = () => {
  if (!['darwin', 'win32'].includes(platform)) {
    throw new Error(`The "${platform}" platform is not supported`)
  }

  const resourcesPath = platform === 'darwin'
    ? '/Applications/Zalo.app/Contents/Resources'
    : process.env.USERPROFILE + '/AppData/Local/Programs/Zalo/Zalo-*/resources'

  const resources = glob.sync(resourcesPath)

  if (!Array.isArray(resources) || !resources.length) {
    throw new Error('Zalo Resources not found')
  }

  return getLastElOfArray(resources.sort())
}

const isEnabledDarkTheme = (zaloDir) => {
  const zaDarkJS = path.join(zaloDir, 'app/pc-dist/za-dark-pc.js')
  return fs.existsSync(zaDarkJS)
}

const writeIndexFile = (zaloDir) => {
  const src = 'pc-dist/index.html'
  const srcPath = path.join(zaloDir, `app/${src}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' doesn\'t exist.')
  }

  const indexHTMLContent = fs.readFileSync(srcPath, 'utf8')
  const root = HTMLParser.parse(indexHTMLContent)

  const zaDarkCSS = root.querySelectorAll('link[href="za-dark.css"]')
  if (!zaDarkCSS.length) {
    root.getElementsByTagName('head')[0].insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="za-dark.css">'
    )
  }

  const zaDarkJS = root.querySelectorAll('script[src="za-dark-pc.js"]')
  if (!zaDarkJS.length) {
    root.getElementsByTagName('body')[0].insertAdjacentHTML(
      'beforeend',
      '<script src="za-dark-pc.js"></script>'
    )
  }

  fs.writeFileSync(srcPath, root.toString())
  logDebug('- writeIndexFile', srcPath)
}

const copyAssetFile = (zaloDir, { dest, src }) => {
  const srcPath = path.join(__dirname, `../../pc-dist/assets/${src}`)
  const destPath = path.join(zaloDir, `app/${dest}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' doesn\'t exist.')
  }

  const newContents = fs.readFileSync(srcPath, 'utf8')

  fs.writeFileSync(destPath, newContents)

  logDebug('- copyAssetFile', src, '➜', destPath)
}

const enableDarkTheme = async (zaloDir) => {
  if (!fs.existsSync(zaloDir)) {
    throw new Error(zaloDir + ' doesn\'t exist.')
  }

  const appDirPath = path.join(zaloDir, 'app')
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (!fs.existsSync(appAsarPath)) {
    throw new Error(zaloDir + ' doesn\'t contain "app.asar".')
  }

  if (!fs.existsSync(appAsarBakPath)) {
    logDebug('- backupFile', appAsarPath)
    fs.createReadStream(appAsarPath).pipe(fs.createWriteStream(appAsarBakPath))
  }

  asar.extractAll(appAsarPath, appDirPath)

  writeIndexFile(zaloDir)
  copyAssetFile(zaloDir, {
    src: 'css/za-dark.css',
    dest: 'pc-dist/za-dark.css'
  })
  copyAssetFile(zaloDir, {
    src: `js/za-dark-pc.${platform}.js`,
    dest: 'pc-dist/za-dark-pc.js'
  })

  await del(appAsarPath, { force: true })
  logDebug('- deleteFile', appAsarPath)

  log(chalk.green('➜ Done.'))
}

const restoreTheme = async (zaloDir) => {
  const appDirPath = path.join(zaloDir, 'app')
  const appAsarPath = path.join(zaloDir, 'app.asar')
  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (fs.existsSync(appDirPath)) {
    await del(appDirPath, { force: true })
    logDebug('- deleteDir', appDirPath)
  }

  if (fs.existsSync(appAsarBakPath)) {
    if (fs.existsSync(appAsarPath)) {
      await del(appAsarPath, { force: true })
      logDebug('- deleteFile', appAsarPath)
    }

    fs.renameSync(appAsarBakPath, appAsarPath)
    logDebug('- renameFile', appAsarBakPath, '➜', appAsarPath)
  }

  log(chalk.green('➜ Done.'))
}

module.exports = {
  getDefaultZaloResDir,
  isEnabledDarkTheme,
  enableDarkTheme,
  restoreTheme
}
