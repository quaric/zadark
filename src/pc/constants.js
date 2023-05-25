const os = require('os')
const packageJSON = require('./package.json')

const PLATFORM = os.platform()
const IS_MAC = PLATFORM === 'darwin'
const IS_WIN = PLATFORM === 'win32'
const IS_DEV = process.env === 'development'

const ZADARK_VERSION = packageJSON.version

const DEFAULT_ZALO_PATH = IS_MAC
  ? '/Applications/Zalo.app' // ! Can't be changed
  : process.env.USERPROFILE + '/AppData/Local/Programs/Zalo' // ! Can't be changed

const EXAMPLE_CUSTOM_ZALO_PATH = IS_MAC
  ? '/ThuMucDaCaiZalo/Zalo.app'
  : 'D:\\ThuMucDaCaiZalo\\Zalo'

const DOWNLOAD_ZADARK_URL = IS_MAC
  ? 'https://sourceforge.net/projects/zadark/files/ZaDarkPC/macOS'
  : 'https://sourceforge.net/projects/zadark/files/ZaDarkPC/Windows'

const COMMON_ERRORS_URL = IS_MAC
  ? 'https://zadark.quaric.com/pc/macos#common-errors'
  : 'https://zadark.quaric.com/pc/windows#common-errors'

const CONTACT_URL = 'https://zadark.quaric.com/contact'

module.exports = {
  PLATFORM,
  IS_MAC,
  IS_WIN,
  IS_DEV,

  ZADARK_VERSION,

  DEFAULT_ZALO_PATH,
  EXAMPLE_CUSTOM_ZALO_PATH,

  DOWNLOAD_ZADARK_URL,
  COMMON_ERRORS_URL,
  CONTACT_URL
}
