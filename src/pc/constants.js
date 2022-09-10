/*
  ZaDark – Zalo Dark Mode
  Made by NCDAi Studio
*/

const os = require('os')
const packageJSON = require('./package.json')

const PLATFORM = os.platform()
const ZADARK_VERSION = packageJSON.version
const DARK_TYPE_LABEL = {
  dark: 'default',
  dark_dimmed: 'dimmed'
}

module.exports = {
  PLATFORM,
  ZADARK_VERSION,
  DARK_TYPE_LABEL
}
