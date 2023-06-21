const os = require('os')
const packageJSON = require('./package.json')

const PLATFORM = os.platform()
const OS_NAME = PLATFORM === 'darwin' ? 'macOS' : 'Windows'
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

const FEEDBACK_UNINSTALL_URL = `https://docs.google.com/forms/d/e/1FAIpQLSdLonVbx-IavimDRneKuUhtMox4vDbyu35tB6uzQG8FGJFbUg/viewform?usp=pp_url&entry.454875478=${IS_MAC ? 'macOS' : 'Windows'}`

module.exports = {
  PLATFORM,
  OS_NAME,
  IS_MAC,
  IS_WIN,
  IS_DEV,

  ZADARK_VERSION,

  DEFAULT_ZALO_PATH,
  EXAMPLE_CUSTOM_ZALO_PATH,

  DOWNLOAD_ZADARK_URL,
  COMMON_ERRORS_URL,
  CONTACT_URL,
  FEEDBACK_UNINSTALL_URL
}
