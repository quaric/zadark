/*
  ZaDark – Zalo Dark Mode
  Made by NCDAi Studio
*/

const os = require('os')
const prompt = require('prompt-sync')()
const chalk = require('chalk')
const zaDarkPC = require('./zadark-pc')
const packageJSON = require('./package.json')

const { log, logError, open } = require('./utils')

const platform = os.platform()
const version = packageJSON.version

const renderHeader = () => {
  log('')
  log(chalk.blueBright.bold('ZaDark – Zalo Dark Mode'))
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
    // [Luu y quan trong]
    log('')
    log(chalk.redBright('1. TO BE SAFE, before installing make sure you have downloaded this program from'))
    // 1. DE AN TOAN, truoc khi cai dat hay chac chan ban da tai chuong trinh tu
    log('  ', chalk.underline.redBright('https://sourceforge.net/projects/zadark/files/ZaDarkPC/'))
    log('')
    log('2. Please exit Zalo before installing/uninstalling Dark Theme.')
    // 2. Vui long thoat Zalo truoc khi cai dat/go cai dat Dark Theme.
    log('3. Please uninstall Dark Theme before installing Zalo updates.')
    // 3. Vui long go cai dat Dark Theme truoc khi cap nhat Zalo.
    log('4. Please uninstall Dark Theme when Zalo encounters an error.')
    // 4. Vui long go cai dat Dark Theme khi Zalo xay ra loi.
    log('')

    prompt(chalk.yellowBright('> Press', chalk.bold('[enter]'), 'to continue ...'))
    // > Nhan [enter] de tiep tuc ...

    console.clear()
    renderHeader()

    log(chalk.magentaBright('[Features]')) // Chuc Nang
    log('')
    log('1. Install Dark default') // Cai Dark default
    log('2. Install Dark dimmed') // Cai Dark dimmed
    log('3. Uninstall theme') // Go cai dat
    log('')

    log('4. Changelog') // Lich su cap nhat
    log('5. Contact') // Lien he
    log('6. Exit') // Thoat
    log('')

    const selected = prompt(chalk.yellowBright('> Select the appropriate number', chalk.bold('[1-6]'), 'then', chalk.bold('[enter]'), ': '))
    // Nhap STT chuc nang [1-6], sau do nhan [enter] :

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
        // [Cai dat Dark Theme]

        log('')
        log('Do you want to enable "Sync with system"?')
        // Ban co muon kich hoat chuc nang "Dong bo giao dien voi he dieu hanh" khong?
        log('Once enabled, Zalo theme will match your system settings.')
        // Khi ban kich hoat, giao dien Zalo se thay doi theo giao dien he dieu hanh.
        log('')

        const isSyncWithSystem = prompt(chalk.yellowBright('> Press', chalk.bold('[Y]'), 'to enable,', chalk.bold('[enter]'), 'to skip : ')).toUpperCase() === 'Y'
        // > Nhan [Y] de kich hoat, nhan [enter] de bo qua :

        for (const zaloResDir of zaloResDirList) {
          log('')
          log(chalk('>> Installing at', chalk.bold(zaloResDir)))
          // >> Dang cai dat
          await zaDarkPC.installDarkTheme(zaloResDir, darkTheme, isSyncWithSystem)
        }

        log('')
        log(chalk.green('>> Installed successfully. Please restart Zalo.'))
        // >> Cat dat thanh cong. Vui long khoi dong lai Zalo.

        break
      }

      case '3': {
        log(chalk.magentaBright('[Uninstall Dark Theme]'))
        // [Go cai dat Dark Theme]

        for (const zaloResDir of zaloResDirList) {
          log('')
          log(chalk('>> Uninstalling at', chalk.bold(zaloResDir)))
          // >> Dang go cai dat
          await zaDarkPC.uninstallDarkTheme(zaloResDir)
        }

        log('')
        log(chalk.green('>> Uninstalled successfully. Please restart Zalo.'))
        // >> Go cai dat thanh cong. Vui long khoi dong lai Zalo.

        break
      }

      case '4': {
        log(chalk.magentaBright('[Changelog]'))
        // [Lich su cap nhat]

        const changelogUrl = 'https://github.com/ncdai3651408/za-dark/blob/main/CHANGELOG.md'
        log('>> Opening', chalk.underline(changelogUrl))
        // >> Dang mo
        open(changelogUrl)

        break
      }

      case '5': {
        log(chalk.magentaBright('[Contact]'))

        const contactUrl = 'https://zadark.ncdaistudio.com/contact'
        log('>> Opening', chalk.underline(contactUrl))
        // >> Dang mo
        open(contactUrl)

        break
      }

      default: {
        log(chalk.magentaBright('[Exit]'))
        // [Thoat]
        break
      }
    }
  } catch (error) {
    log('')
    logError('Error :', error.message)
    // Loi :
  } finally {
    log('')
    log('Thank you so much!')
    // Cam on ban!
    log('Goodbye.')
    // Goodbye.
    log('')
    prompt(chalk.yellowBright('> Press', chalk.bold('[enter]'), 'to exit ...'))
    // > Nhan [enter] de thoat ...
  }
})()
