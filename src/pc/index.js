const prompt = require('prompt-sync')()
const chalk = require('chalk')
const inquirer = require('inquirer')

const zadarkPC = require('./zadark-pc')
const { print, printError, openWebsite, clearScreen, killProcesses } = require('./utils')

const {
  ZADARK_VERSION,
  IS_MAC,
  COMMON_ERRORS_URL,
  DEFAULT_ZALO_PATH,
  EXAMPLE_CUSTOM_ZALO_PATH,
  DOCS_URL
} = require('./constants')

const promptFeatureIndex = async () => {
  const { featureIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'featureIndex',
      message: chalk.magentaBright('[CHON CHUC NANG]'),
      prefix: ' ',
      choices: [
        new inquirer.Separator(' '),
        {
          name: 'Cai dat ZaDark',
          value: '1'
        },
        {
          name: 'Go cai dat ZaDark',
          value: '2'
        },
        {
          name: 'Huong dan',
          value: '3'
        },
        {
          name: 'Thoat',
          value: '4'
        }
      ]
    }
  ])
  return featureIndex
}

const handlePromptCustomZaloPath = () => {
  print(chalk.magentaBright.bold('[TUY CHINH DUONG DAN ZALO]'))
  print('')

  print(`Khong tim thay Zalo PC tai duong dan mac dinh (${DEFAULT_ZALO_PATH}).`)
  print('')

  const customZaloPath = prompt(chalk.yellowBright(`> Nhap duong dan Zalo PC (VD: ${EXAMPLE_CUSTOM_ZALO_PATH}) va nhan phim`, chalk.bold('[enter]'), ': '))
  return customZaloPath
}

const renderHeader = () => {
  print('')
  print(chalk.blueBright.bold(`ZaDark for ${IS_MAC ? 'macOS' : 'Windows'} ${ZADARK_VERSION} (${process.arch})`))
  print(chalk.blueBright(chalk.underline('https://zadark.com')))
  print('')
}

const renderNotes = () => {
  print(chalk.redBright('- DE DAM BAO AN TOAN, vui long tai ZaDark tai:'))
  print(' ', chalk.underline.redBright('https://zadark.com'))
  print(' ', chalk.underline.redBright('https://sourceforge.net/projects/zadark'))
  print(chalk.redBright('- Vui long cai dat lai ZaDark sau khi cap nhat Zalo PC.'))
  print('')
}

const handleQuitZalo = async () => {
  const zaloPIDs = await zadarkPC.getZaloProcessIds()

  if (!Array.isArray(zaloPIDs) || !zaloPIDs?.length) {
    return
  }

  print('')
  print(chalk('>> Dang thoat Zalo PC ...'))
  killProcesses(zaloPIDs)
}

/**
 * @param {string[]} zaloResDirList
 */
const handleInstall = async (zaloResDirList) => {
  print(chalk.magentaBright.bold('[CAI DAT ZADARK]'))

  await handleQuitZalo()

  // Install latest version
  const zaloResDir = zaloResDirList[zaloResDirList.length - 1]
  print('')
  print(chalk('>> Dang cai dat', chalk.bold(zaloResDir)))
  print(chalk.cyanBright('>> Vui long cho trong giay lat. Co the se mat vai phut ...'))
  await zadarkPC.installZaDark(zaloResDir)

  print('')
  print(chalk.greenBright('>> Da cai dat ZaDark. Vui long mo lai Zalo PC.'))
}

/**
 * @param {string[]} zaloResDirList
 */
const handleUninstall = async (zaloResDirList) => {
  print(chalk.magentaBright.bold('[GO CAI DAT ZADARK]'))

  await handleQuitZalo()

  // Uninstall latest version
  const zaloResDir = zaloResDirList[zaloResDirList.length - 1]
  print('')
  print(chalk('>> Dang go cai dat', chalk.bold(zaloResDir)))
  zadarkPC.uninstallZaDark(zaloResDir)

  print('')
  print(chalk.greenBright('>> Da go cai dat ZaDark. Vui long mo lai Zalo PC.'))
}

const handleOpenDocs = () => {
  print(chalk.magentaBright.bold('[HUONG DAN]'))
  print('')
  print('>> Truy cap:', chalk.underline(DOCS_URL))
  openWebsite(DOCS_URL)
}

(async () => {
  const [action, zaloPath] = process.argv.slice(2)
  const shouldUseCommand = ['install', 'in', 'uninstall', 'un', '-v', '--version'].includes(action)

  if (shouldUseCommand) {
    const zaloResDirList = zadarkPC.getZaloResDirList(zaloPath || DEFAULT_ZALO_PATH)

    try {
      if (!zaloResDirList.length) {
        throw new Error(`Khong tim thay Zalo PC ${zaloPath || DEFAULT_ZALO_PATH} (E008).\nVui long cai dat Zalo PC: https://zalo.me/pc`)
      }

      if (['install', 'in'].includes(action)) {
        await handleInstall(zaloResDirList)
      }

      if (['uninstall', 'un'].includes(action)) {
        await handleUninstall(zaloResDirList)
      }

      if (['-v', '--version'].includes(action)) {
        print(`ZaDark ${ZADARK_VERSION} (${process.arch})`)
      }
    } catch (error) {
      print(chalk.magentaBright.bold('[XAY RA LOI]'))
      print('')
      printError(error.message)
    }
    return
  }

  try {
    let zaloResDirList = zadarkPC.getZaloResDirList(DEFAULT_ZALO_PATH)

    if (!zaloResDirList.length) {
      clearScreen()
      renderHeader()
      renderNotes()

      const customZaloPath = handlePromptCustomZaloPath()
      zaloResDirList = zadarkPC.getZaloResDirList(customZaloPath)

      if (!zaloResDirList.length) {
        throw new Error(`Khong tim thay Zalo PC ${customZaloPath} (E009).\nVui long cai dat Zalo PC: https://zalo.me/pc`)
      }
    }

    clearScreen()
    renderHeader()
    renderNotes()

    const featureIndex = await promptFeatureIndex()

    clearScreen()
    if (['1', '2', '3'].includes(featureIndex)) {
      renderHeader()
    }

    switch (featureIndex) {
      case '1': {
        await handleInstall(zaloResDirList)
        break
      }

      case '2': {
        await handleUninstall(zaloResDirList)
        break
      }

      case '3': {
        handleOpenDocs()
        break
      }
    }
  } catch (error) {
    clearScreen()
    renderHeader()

    print(chalk.magentaBright.bold('[XAY RA LOI]'))
    print('')
    printError(error.message)

    openWebsite(COMMON_ERRORS_URL)
    print(`Xem huong dan: ${COMMON_ERRORS_URL}`)
    //
  } finally {
    print('')

    print('Cam on ban da su dung ZaDark, chuc ban lam viec hieu qua!')
    print('')

    prompt(chalk.yellowBright('> Nhan phim', chalk.bold('[Enter]'), 'de thoat ... '))
  }
})()
