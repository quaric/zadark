/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

const prompt = require('prompt-sync')()
const chalk = require('chalk')

const zaDarkPC = require('./zadark-pc')
const { log, logError, open, isRoot } = require('./utils')
const { PLATFORM, ZADARK_VERSION } = require('./constants')

const renderHeader = () => {
  log('')
  log(chalk.blueBright.bold('ZaDark – Zalo Dark Mode'))
  log(chalk.blueBright('Website   :', chalk.underline('https://zadark.quaric.com')))
  log(chalk.blueBright('Phien ban :', `${PLATFORM === 'darwin' ? 'macOS' : 'Windows'}-${ZADARK_VERSION}`))
  log('')
  log(chalk.blueBright('<ZaDark from Quaric>'))
  log('')
}

const handleInstall = async (zaloResDirList) => {
  log(chalk.magentaBright.bold('[CAI DAT ZADARK]'))

  for (const zaloResDir of zaloResDirList) {
    log('')
    log(chalk('>> Dang cai dat', chalk.bold(zaloResDir)))
    await zaDarkPC.installDarkTheme(zaloResDir)
  }

  log('')
  log(chalk.green('>> Da cai dat ZaDark. Vui long khoi dong lai Zalo PC.'))
}

const handleUninstall = async (zaloResDirList) => {
  log(chalk.magentaBright.bold('[GOI CAI DAT ZADARK]'))

  for (const zaloResDir of zaloResDirList) {
    log('')
    log(chalk('>> Dang go cai dat', chalk.bold(zaloResDir)))
    await zaDarkPC.uninstallDarkTheme(zaloResDir)
  }

  log('')
  log(chalk.green('>> Da go cai dat ZaDark. Vui long khoi dong lai Zalo PC.'))
}

(async () => {
  try {
    if (PLATFORM === 'darwin' && !isRoot()) {
      const supportUrl = 'https://zadark.quaric.com/pc/macos#run-zadark-as-root'
      open(supportUrl)
      throw new Error(`Vui long chay ZaDark voi quyen Root (${supportUrl}).`)
    }

    const defaultZaloPath = PLATFORM === 'darwin'
      ? '/Applications/Zalo.app' // ! Can't be changed
      : process.env.USERPROFILE + '/AppData/Local/Programs/Zalo' // ! Can't be changed

    let zaloResDirList = zaDarkPC.getZaloResDirList(defaultZaloPath)
    if (!zaloResDirList.length) {
      log('')
      log(chalk.redBright(`Khong tim thay Zalo PC tai duong dan mac dinh (${defaultZaloPath}).`))
      log('')

      log(chalk.magentaBright.bold('[TUY CHINH DUONG DAN ZALO]'))
      log('')

      const examplePath = PLATFORM === 'darwin' ? '/ThuMucDaCaiZalo/Zalo.app' : 'D:\\ThuMucDaCaiZalo\\Zalo'
      const customZaloPath = prompt(chalk.yellowBright(`> Nhap duong dan Zalo PC cua ban (VD: ${examplePath}) : `))

      zaloResDirList = zaDarkPC.getZaloResDirList(customZaloPath)
      if (!zaloResDirList.length) {
        throw new Error('Khong tim thay Zalo PC. Vui long tai va cai dat Zalo PC tai "https://zalo.me/pc".')
      }
    }

    console.clear()
    renderHeader()

    log(chalk.magentaBright.bold('[LUU Y QUAN TRONG]'))
    log('')
    log(chalk.redBright('1. DE DAM BAO AN TOAN, truoc khi cai dat hay chac chan ban da tai ZaDark tu'))
    log('  ', chalk.underline.redBright('https://sourceforge.net/projects/zadark/files/ZaDarkPC/'))
    log('2. Vui long thoat Zalo PC truoc khi cai dat, go cai dat ZaDark.')
    log('3. Vui long cai dat lai ZaDark sau khi cap nhat Zalo PC.')
    log('')

    prompt(chalk.yellowBright('> Nhan', chalk.bold('[enter]'), 'de bat dau ...'))

    console.clear()
    renderHeader()

    log(chalk.magentaBright.bold('[CHUC NANG]'))
    log('')
    log('1. Cai dat ZaDark')
    log('2. Go cai dat ZaDark')
    log('3. Thoat')
    log('')

    const featureIndex = prompt(chalk.yellowBright('> Nhap STT chuc nang', chalk.bold('[1-3]'), 'va nhan', chalk.bold('[enter]'), ': '))

    console.clear()
    renderHeader()

    switch (featureIndex) {
      case '1': {
        await handleInstall(zaloResDirList)
        break
      }

      case '2': {
        await handleUninstall(zaloResDirList)
        break
      }

      default: {
        log(chalk.magentaBright.bold('[THOAT]'))
        break
      }
    }
  } catch (error) {
    log('')
    logError('Xay ra loi :', error.message)
  } finally {
    log('')
    log('Cam on ban da su dung ZaDark, chuc ban lam viec hieu qua!')
    log('Goodbye.')
    log('')
    prompt(chalk.yellowBright('> Nhan', chalk.bold('[enter]'), 'de thoat chuong trinh ...'))
  }
})()
