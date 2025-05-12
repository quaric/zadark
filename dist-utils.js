const path = require('path')

const chromeManifest = require('./src/web/vendor/chrome/manifest.json')
const firefoxManifest = require('./src/web/vendor/firefox/manifest.json')
const edgeManifest = require('./src/web/vendor/edge/manifest.json')
const pcPackageJSON = require('./src/pc/package.json')

const getVersion = (platform) => {
  switch (platform) {
    case 'CHROME':
      return chromeManifest.version
    case 'FIREFOX':
      return firefoxManifest.version
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

const FILE_NAME_ORIGINAL = {
  CHROME: `zadark${getVersion('CHROME')}-chrome.zip`,
  CHROME_CRX: `zadark${getVersion('CHROME')}-chrome.crx`,
  FIREFOX: `zadark${getVersion('FIREFOX')}-firefox.zip`,
  EDGE: `zadark${getVersion('EDGE')}-edge.zip`,
  MACOS: `zadark${getVersion('MACOS')}-macos`,
  MACOS_X64: `zadark${getVersion('MACOS')}-macos-x64`,
  MACOS_ARM64: `zadark${getVersion('MACOS')}-macos-arm64`,
  WINDOWS: `zadark${getVersion('WINDOWS')}-windows.exe`
}

const FILE_NAME_ZIP = {
  CHROME: `zadark${getVersion('CHROME')}-chrome.zip`,
  CHROME_CRX: `zadark${getVersion('CHROME')}-chrome.crx`,
  FIREFOX: `zadark${getVersion('FIREFOX')}-firefox.zip`,
  EDGE: `zadark${getVersion('EDGE')}-edge.zip`,
  MACOS: `zadark${getVersion('MACOS')}-macos.zip`,
  MACOS_X64: `zadark${getVersion('MACOS')}-macos-x64.zip`,
  MACOS_ARM64: `zadark${getVersion('MACOS')}-macos-arm64.zip`,
  WINDOWS: `zadark${getVersion('WINDOWS')}-windows.zip`
}

const getFileNameOriginal = (plat) => {
  return FILE_NAME_ORIGINAL[plat]
}

const getFileNameZip = (plat) => {
  return FILE_NAME_ZIP[plat]
}

const getFileDir = (platform) => {
  return path.join(__dirname, './dist')
}

const getFilePath = (platform, isOriginalFile = false) => {
  return path.join(
    getFileDir(platform),
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
