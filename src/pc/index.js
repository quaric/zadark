/*
  ZaDark – Best Dark Theme for Zalo
  Made by NCDAi Studio
*/

const os = require('os')
const prompt = require('prompt-sync')()
const chalk = require('chalk')
const zaDarkPC = require('./za-dark-pc')
const packageJSON = require('./package.json')

const { log, logError, open } = require('./utils')

const platform = os.platform()
const version = packageJSON.version

const renderHeader = () => {
  log('')
  log(chalk.blueBright.bold('ZaDark – Best Dark Theme for Zalo'))
  log(chalk.blueBright('Version :', `${platform === 'darwin' ? 'macOS' : 'Windows'}-${version}`))
  log(chalk.blueBright('Website :', chalk.underline('https://zadark.ncdaistudio.com')))
  log('')
}

(async () => {
  try {
    const zaloResDirList = zaDarkPC.getDefaultZaloResDirList()

    console.clear()
    renderHeader()

    log(chalk.magentaBright('[Important Notes]'))
    log('')
    log(chalk.redBright('1. TO BE SAFE, before installing make sure you have downloaded this program from'))
    log('  ', chalk.underline.redBright('https://sourceforge.net/projects/zadark/files/ZaDarkPC/'))
    log('')
    log('2. Please exit Zalo before installing/uninstalling Dark Theme.')
    log('3. Please uninstall Dark Theme before installing Zalo updates.')
    log('4. Please uninstall Dark Theme when Zalo encounters an error.')
    log('')

    prompt(chalk.yellowBright('> Press', chalk.bold('[enter]'), 'to continue ...'))
    // log('')

    console.clear()
    renderHeader()

    log(chalk.magentaBright('[Features]'))
    log('')
    log('1. Install Dark default')
    log('2. Install Dark dimmed')
    log('3. Uninstall theme')
    log('')

    log('4. Changelog')
    log('5. Contact')
    log('6. Exit')
    log('')

    const selected = prompt(chalk.yellowBright('> Select the appropriate number', chalk.bold('[1-5]'), 'then', chalk.bold('[enter]'), ': '))
    // log('')

    console.clear()
    renderHeader()

    switch (selected) {
      case '1': // Dark default
      case '2': { // Dark dimmed
        const darkTheme = selected === '1' ? 'dark' : 'dark_dimmed'
        const darkThemeLabel = {
          dark: 'default',
          dark_dimmed: 'dimmed'
        }

        log(chalk.magentaBright(`[Install Dark Theme (${darkThemeLabel[darkTheme]})]`))

        log('')
        log('Do you want to enable "Sync with system"?')
        log('Once enabled, Zalo theme will match your system settings.')
        log('')

        const isSyncWithSystem = prompt(chalk.yellowBright('> Press', chalk.bold('[Y]'), 'to enable,', chalk.bold('[enter]'), 'to skip : ')).toUpperCase() === 'Y'

        for (const zaloResDir of zaloResDirList) {
          log('')
          log(chalk('>> Installing at', chalk.bold(zaloResDir)))
          await zaDarkPC.installDarkTheme(zaloResDir, darkTheme, isSyncWithSystem)
        }

        log('')
        log(chalk.green('>> Installed successfully. Please restart Zalo.'))

        break
      }

      case '3': {
        log(chalk.magentaBright('[Uninstall Dark Theme]'))

        for (const zaloResDir of zaloResDirList) {
          log('')
          log(chalk('>> Uninstalling at', chalk.bold(zaloResDir)))
          await zaDarkPC.uninstallDarkTheme(zaloResDir)
        }

        log('')
        log(chalk.green('>> Uninstalled successfully. Please restart Zalo.'))

        break
      }

      case '4': {
        log(chalk.magentaBright('[Changelog]'))
        log('>> Opening', chalk.underline('https://github.com/ncdai3651408/za-dark/blob/main/CHANGELOG.md'))
        open('https://github.com/ncdai3651408/za-dark/blob/main/CHANGELOG.md')
        break
      }

      case '5': {
        log(chalk.magentaBright('[Contact]'))
        log('- Email :', chalk.bold('ncdai@penphy.edu.vn'))
        log('- Messenger :', chalk.bold('m.me/iamncdai'))
        break
      }

      default: {
        log(chalk.magentaBright('[Exit]'))
        break
      }
    }
  } catch (error) {
    log('')
    logError('Error :', error.message)
  } finally {
    log('')
    log('Thank you so much!')
    log('Goodbye.')
    log('')
    prompt(chalk.yellowBright('> Press', chalk.bold('[enter]'), 'to exit ...'))
  }
})()
