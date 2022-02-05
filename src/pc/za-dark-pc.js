/*
  Za Dark – Best Dark Theme for Zalo
  Made by NCDAi
*/

const fs = require('fs')
const os = require('os')
const path = require('path')
const del = require('del')
const asar = require('asar')
const glob = require('glob')
const chalk = require('chalk')
const HTMLParser = require('node-html-parser')

const getLastElOfArray = (arr) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr[arr.length - 1]
  }
  return null
}

const getDefaultZaloResDir = () => {
  const platform = os.platform()

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
  console.log('- writeIndexFile', srcPath)
}

const copyAssetFile = (zaloDir, { dest, src }) => {
  const srcPath = path.join(__dirname, `../../pc-dist/assets/${src}`)

  if (!fs.existsSync(srcPath)) {
    throw new Error(srcPath + ' doesn\'t exist.')
  }

  const newContents = fs.readFileSync(srcPath, 'utf8')

  const destPath = path.join(zaloDir, `app/${dest}`)
  fs.writeFileSync(destPath, newContents)

  console.log('- copyAssetFile', src, '➜', destPath)
}

const setTheme = function (zaloDir, theme) {
  if (!['dark', 'light'].includes(theme)) {
    throw new Error(`Theme "${theme}" is not valid.`)
  }

  if (!fs.existsSync(zaloDir)) {
    throw new Error(zaloDir + ' doesn\'t exist.')
  }

  if (!fs.existsSync(path.join(zaloDir, 'app.asar'))) {
    throw new Error(zaloDir + ' doesn\'t contain "app.asar".')
  }

  if (!fs.existsSync(path.join(zaloDir, 'app.asar.bak'))) {
    console.log('- backupFile', path.join(zaloDir, 'app.asar'))
    fs.createReadStream(path.join(zaloDir, 'app.asar')).pipe(fs.createWriteStream(path.join(zaloDir, 'app.asar.bak')))
  }

  asar.extractAll(path.join(zaloDir, 'app.asar'), path.join(zaloDir, 'app'))

  const platform = os.platform()

  writeIndexFile(zaloDir)
  copyAssetFile(zaloDir, {
    src: 'css/za-dark.css',
    dest: 'pc-dist/za-dark.css'
  })
  copyAssetFile(zaloDir, {
    src: `js/${theme}/za-dark-pc.${platform}.js`,
    dest: 'pc-dist/za-dark-pc.js'
  })

  console.log(chalk.green('➜ Done ✅'))
}

const restoreDefaults = async (zaloDir) => {
  const appDirPath = path.join(zaloDir, 'app')

  if (fs.existsSync(appDirPath)) {
    console.log('- deleteDir', appDirPath)
    await del(appDirPath, { force: true })
  }

  const appAsarBakPath = path.join(zaloDir, 'app.asar.bak')

  if (fs.existsSync(appAsarBakPath)) {
    console.log('- deleteFile', appAsarBakPath)
    fs.unlinkSync(appAsarBakPath)
  }

  console.log(chalk.green('➜ Done ✅'))
}

module.exports = {
  getDefaultZaloResDir,
  setTheme,
  restoreDefaults
}
