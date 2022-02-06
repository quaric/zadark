/*
  Za Dark – Best Dark Theme for Zalo
  Made by NCDAi
*/

const os = require('os')
const prompt = require('prompt-sync')()
const chalk = require('chalk')
const zaDarkPC = require('./za-dark-pc')
const packageJSON = require('./package.json')

const { log, logError } = require('../../utils')

const platform = os.platform()
const version = packageJSON.version;

(async () => {
  try {
    const zaloResDir = zaDarkPC.getDefaultZaloResDir()
    const isEnabledDarkTheme = zaDarkPC.isEnabledDarkTheme(zaloResDir)

    log('')
    log(chalk.blueBright.bold('Za Dark PC – Best Dark Theme for Zalo PC'))
    log(chalk.blueBright.bold('Made by NCDAi'))
    log(chalk.blueBright('Version :', `${platform === 'darwin' ? 'macOS' : 'Windows'}-${version}`))
    log(chalk.blueBright('Zalo Resources :', zaloResDir))

    log('')
    log(isEnabledDarkTheme ? chalk.green('[i] Dark Theme has been', chalk.bold('enabled.')) : chalk.grey('[i] Dark Theme has been', chalk.bold('disabled.')))

    log('')
    prompt(chalk.redBright('Please exit Zalo App! Press', chalk.bold('[enter]'), 'to continue ...'))

    log('')
    log('[1] Enable Dark Theme')
    log('[2] Disable Dark Theme')

    log('')
    log('[3] Support')
    log('[4] Exit')
    log('')

    const selected = prompt(chalk('[?] Select the appropriate number', chalk.bold('[1-4]'), 'then', chalk.bold('[enter]'), ': '))

    log('')

    switch (selected) {
      case '1': {
        log(chalk.green('➜ Enable Dark Theme ...'))
        if (isEnabledDarkTheme) {
          log(chalk.green('[i] Dark Theme has been', chalk.bold('enabled.')))
        }
        await zaDarkPC.enableDarkTheme(zaloResDir)
        break
      }

      case '2': {
        log(chalk.green('➜ Disable Dark Theme ...'))
        await zaDarkPC.restoreTheme(zaloResDir)
        break
      }

      case '3': {
        log(chalk.green('➜ Support'))
        log('- Email : ncdai+zadarkpc@penphy.edu.vn')
        log('- Messenger : m.me/iamncdai')
        break
      }

      default: {
        log(chalk.green('Thank you so much!'))
        log(chalk.green('Goodbye ✌️'))
        break
      }
    }
  } catch (error) {
    logError('Error :', error.message)
  } finally {
    log('')
    prompt(chalk('Press', chalk.bold('[enter]'), 'to exit ...'))
  }
})()
