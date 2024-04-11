const path = require('path')

const chromeManifest = require('./src/web/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/web/vendor/firefox/manifest.json')
const operaManifest = require('./src/web/vendor/opera/manifest.json')
const edgeManifest = require('./src/web/vendor/edge/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const getVersion = (platform) => {
  switch (platform) {
    case 'CHROME':
      return chromeManifest.version
    case 'FIREFOX':
      return firefoxManifest.version
    case 'OPERA':
      return operaManifest.version
    case 'EDGE':
      return edgeManifest.version
    case 'MACOS':
      return pcPackageJSON.version
    case 'WINDOWS':
      return pcPackageJSON.version
    default:
      return ''
  }
}

const FILE_DIR = {
  CHROME: './dist/chrome',
  FIREFOX: './dist/firefox',
  OPERA: './dist/opera',
  EDGE: './dist/edge',
  MACOS: './dist/macos',
  MACOS_X64: './dist/macos',
  MACOS_ARM64: './dist/macos',
  WINDOWS: './dist/windows'
}

const FILE_NAME_ORIGINAL = {
  CHROME: `ZaDark Chrome ${getVersion('CHROME')}.zip`,
  FIREFOX: `ZaDark Firefox ${getVersion('FIREFOX')}.zip`,
  OPERA: `ZaDark Opera ${getVersion('OPERA')}.zip`,
  EDGE: `ZaDark Edge ${getVersion('EDGE')}.zip`,
  MACOS: `ZaDark ${getVersion('MACOS')}`,
  MACOS_X64: `ZaDark ${getVersion('MACOS')}-x64`,
  MACOS_ARM64: `ZaDark ${getVersion('MACOS')}-arm64`,
  MACOS_X64_FRIENDLY: `ZaDark ${getVersion('MACOS')} - Intel Chip`,
  MACOS_ARM64_FRIENDLY: `ZaDark ${getVersion('MACOS')} - Apple Chip`,
  WINDOWS: `ZaDark ${getVersion('WINDOWS')}.exe`
}

const FILE_NAME_ZIP = {
  CHROME: `ZaDark Chrome ${getVersion('CHROME')}.zip`,
  FIREFOX: `ZaDark Firefox ${getVersion('FIREFOX')}.zip`,
  OPERA: `ZaDark Opera ${getVersion('OPERA')}.zip`,
  EDGE: `ZaDark Edge ${getVersion('EDGE')}.zip`,
  MACOS: `ZaDark ${getVersion('MACOS')}.zip`,
  MACOS_X64: `ZaDark ${getVersion('MACOS')} - Intel Chip.zip`,
  MACOS_ARM64: `ZaDark ${getVersion('MACOS')} - Apple Chip.zip`,
  WINDOWS: `ZaDark ${getVersion('WINDOWS')}.zip`
}

const getFileNameOriginal = (plat) => {
  return FILE_NAME_ORIGINAL[plat]
}

const getFileNameZip = (plat) => {
  return FILE_NAME_ZIP[plat]
}

const getFileNameMacOSTar = (arch = 'x64') => {
  return `zadark-macos-${pcPackageJSON.version}-${arch}.tar`
}

const getFileDir = (platform) => {
  return path.join(__dirname, FILE_DIR[platform])
}

const getFilePath = (platform, isOriginalFile = false) => {
  return path.join(
    __dirname,
    FILE_DIR[platform],
    isOriginalFile
      ? getFileNameOriginal(platform)
      : getFileNameZip(platform)
  )
}

module.exports = {
  getVersion,

  getFileNameOriginal,
  getFileNameZip,
  getFileNameMacOSTar,

  getFileDir,
  getFilePath
}
