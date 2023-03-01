const path = require('path')

const chromeManifest = require('./src/web/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/web/vendor/firefox/manifest.json')
const operaManifest = require('./src/web/vendor/opera/manifest.json')
const edgeManifest = require('./src/web/vendor/edge/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const dot2Underscore = (v = '') => v.replace(/\./g, '_')

const FILE_NAME = {
  CHROME: `ZaDark-Chrome-${dot2Underscore(chromeManifest.version)}`,
  FIREFOX: `ZaDark-Firefox-${dot2Underscore(firefoxManifest.version)}`,
  OPERA: `ZaDark-Opera-${dot2Underscore(operaManifest.version)}`,
  EDGE: `ZaDark-Edge-${dot2Underscore(edgeManifest.version)}`,
  MACOS: `ZaDark-macOS-${dot2Underscore(pcPackageJSON.version)}`,
  WINDOWS: `ZaDark-Windows-${dot2Underscore(pcPackageJSON.version)}`
}

const FILE_EXT_ORIGINAL = {
  CHROME: '.zip',
  FIREFOX: '.zip',
  OPERA: '.zip',
  EDGE: '.zip',
  MACOS: '',
  WINDOWS: '.exe'
}

const FILE_EXT_ZIP = {
  CHROME: '.zip',
  FIREFOX: '.zip',
  OPERA: '.zip',
  EDGE: '.zip',
  MACOS: '.zip',
  WINDOWS: '.zip'
}

const FILE_DIR = {
  CHROME: './dist/chrome',
  FIREFOX: './dist/firefox',
  OPERA: './dist/opera',
  EDGE: './dist/edge',
  MACOS: './dist/macos',
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
