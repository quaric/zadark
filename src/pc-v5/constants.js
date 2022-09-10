/*
  ZaDark – Zalo Dark Mode
  Made by NCDAi Studio
*/

const os = require('os')
const packageJSON = require('./package.json')

const PLATFORM = os.platform()
const ZADARK_VERSION = packageJSON.version

module.exports = {
  PLATFORM,
  ZADARK_VERSION
}
