/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

const prompt = require('prompt-sync')()
const chalk = require('chalk')

const zadarkPC = require('./zadark-pc')
const { log, logError, open, isRoot, killProcess } = require('./utils')

const { ZADARK_VERSION, IS_MAC } = require('./constants')

const renderHeader = () => {
  log('')
  log(chalk.blueBright.bold(`ZaDark for ${IS_MAC ? 'macOS' : 'Windows'} ${ZADARK_VERSION}`))
  log(chalk.blueBright(chalk.underline('https://zadark.quaric.com')))
  log('')
}

const quitZalo = async () => {
  const zaloPID = await zadarkPC.getZaloProcessId()
  if (zaloPID) {
    log('')
    log(chalk('>> Dang thoat Zalo PC ...'))
    await killProcess(zaloPID)
  }
}

const handleInstall = async (zaloResDirList) => {
  log(chalk.magentaBright.bold('[CAI DAT ZADARK]'))

  await quitZalo()

  for (const zaloResDir of zaloResDirList) {
    log('')
    log(chalk('>> Dang cai dat', chalk.bold(zaloResDir)))
    await zadarkPC.installDarkTheme(zaloResDir)
  }

  log('')
  log(chalk.green('>> Da cai dat ZaDark. Vui long khoi dong lai Zalo PC.'))
}

const handleUninstall = async (zaloResDirList) => {
  log(chalk.magentaBright.bold('[GO CAI DAT ZADARK]'))

  await quitZalo()

  for (const zaloResDir of zaloResDirList) {
    log('')
    log(chalk('>> Dang go cai dat', chalk.bold(zaloResDir)))
    await zadarkPC.uninstallDarkTheme(zaloResDir)
  }

  log('')
  log(chalk.green('>> Da go cai dat ZaDark. Vui long khoi dong lai Zalo PC.'))
}

(async () => {
  let featureIndex

  try {
    if (IS_MAC && !isRoot()) {
      const supportUrl = 'https://zadark.quaric.com/pc/macos#run-zadark-as-root'
      open(supportUrl)
      throw new Error(`Vui long chay ZaDark voi quyen Root (${supportUrl}).`)
    }

    const defaultZaloPath = IS_MAC
      ? '/Applications/Zalo.app' // ! Can't be changed
      : process.env.USERPROFILE + '/AppData/Local/Programs/Zalo' // ! Can't be changed

    let zaloResDirList = zadarkPC.getZaloResDirList(defaultZaloPath)

    if (!zaloResDirList.length) {
      log('')
      log(chalk.redBright(`Khong tim thay Zalo PC tai duong dan mac dinh (${defaultZaloPath}).`))
      log('')

      log(chalk.magentaBright.bold('[TUY CHINH DUONG DAN ZALO]'))
      log('')

      const examplePath = IS_MAC ? '/ThuMucDaCaiZalo/Zalo.app' : 'D:\\ThuMucDaCaiZalo\\Zalo'
      const customZaloPath = prompt(chalk.yellowBright(`> Nhap duong dan Zalo PC cua ban (VD: ${examplePath}) : `))

      zaloResDirList = zadarkPC.getZaloResDirList(customZaloPath)

      if (!zaloResDirList.length) {
        throw new Error('Khong tim thay Zalo PC. Vui long tai va cai dat Zalo PC tai "https://zalo.me/pc".')
      }
    }

    console.clear()
    renderHeader()

    log(chalk.redBright('- DE DAM BAO AN TOAN, vui long tai ZaDark tai:'))
    log(' ', chalk.underline.redBright('https://sourceforge.net/projects/zadark/files/zadarkPC'))
    log(chalk.redBright('- Vui long cai dat lai ZaDark sau khi cap nhat Zalo PC.'))
    log('')

    log(chalk.magentaBright.bold('[CHUC NANG]'))
    log('')
    log('1. Cai dat ZaDark')
    log('2. Go cai dat ZaDark')
    log('3. Thoat')
    log('')

    featureIndex = prompt(chalk.yellowBright('> Nhap STT chuc nang', chalk.bold('[1-3]'), 'va nhan', chalk.bold('[enter]'), ': '))

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

    if (['1', '2'].includes(featureIndex)) {
      prompt(chalk.yellowBright('> Nhan', chalk.bold('[enter]'), 'de thoat chuong trinh ...'))
    }
  }
})()
