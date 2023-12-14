const path = require('path')

const chromeManifest = require('./src/web/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/web/vendor/firefox/manifest.json')
const operaManifest = require('./src/web/vendor/opera/manifest.json')
const edgeManifest = require('./src/web/vendor/edge/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const FILE_NAME = {
  CHROME: `ZaDark Chrome ${chromeManifest.version}`,
  FIREFOX: `ZaDark Firefox ${firefoxManifest.version}`,
  OPERA: `ZaDark Opera ${operaManifest.version}`,
  EDGE: `ZaDark Edge ${edgeManifest.version}`,
  MACOS: `ZaDark ${pcPackageJSON.version} macOS`,
  MACOS_X64: `ZaDark ${pcPackageJSON.version} macOS-x64`,
  MACOS_ARM64: `ZaDark ${pcPackageJSON.version} macOS-arm64`,
  WINDOWS: `ZaDark ${pcPackageJSON.version}`
}

const FILE_EXT_ORIGINAL = {
  CHROME: '.zip',
  FIREFOX: '.zip',
  OPERA: '.zip',
  EDGE: '.zip',
  MACOS: '',
  MACOS_X64: '',
  MACOS_ARM64: '',
  WINDOWS: '.exe'
}

const FILE_EXT_ZIP = {
  CHROME: '.zip',
  FIREFOX: '.zip',
  OPERA: '.zip',
  EDGE: '.zip',
  MACOS: '.zip',
  MACOS_X64: '.zip',
  MACOS_ARM64: '.zip',
  WINDOWS: '.zip'
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

const getFileNameOriginal = (plat) => {
  return FILE_NAME[plat] + FILE_EXT_ORIGINAL[plat]
}

const getFileNameZip = (plat) => {
  return FILE_NAME[plat] + FILE_EXT_ZIP[plat]
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

  getFileDir,
  getFilePath
}
