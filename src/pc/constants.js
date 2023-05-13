/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

const os = require('os')
const packageJSON = require('./package.json')

const PLATFORM = os.platform()
const ZADARK_VERSION = packageJSON.version
const IS_MAC = PLATFORM === 'darwin'

module.exports = {
  PLATFORM,
  ZADARK_VERSION,
  IS_MAC
}
