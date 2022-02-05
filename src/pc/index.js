const os = require('os')
const prompt = require('prompt-sync')()
const chalk = require('chalk')
const zaDarkPC = require('./zaDarkPC')
const packageJSON = require('./package.json')

const platform = os.platform()
const version = packageJSON.version;

(async () => {
  try {
    const zaloResDir = zaDarkPC.getDefaultZaloResDir()

    console.log('')
    console.log(chalk.blueBright('Za Dark PC – Best Dark Theme for Zalo PC'))
    console.log(chalk.blueBright('Made by NCDAi'))
    console.log(chalk.blueBright(`v${version} (${platform === 'darwin' ? 'macOS' : 'Windows'})`))
    console.log('')
    console.log('Please select dark/light theme, restore defaults, support or quit.')
    console.log('')
    console.log('[1] Dark Theme')
    console.log('[2] Light Theme')
    console.log('[3] Restore Defaults')
    console.log('')
    console.log('[4] Support')
    console.log('[5] Quit')
    console.log('')

    const selected = prompt('[?] Select the appropriate number [1-4] then [enter]: ')

    console.log('')

    switch (selected) {
      case '1': {
        console.log(chalk.green('➜ Dark Theme'))
        zaDarkPC.setTheme(zaloResDir, 'dark')
        break
      }

      case '2': {
        console.log(chalk.green('➜ Light Theme'))
        zaDarkPC.setTheme(zaloResDir, 'light')
        break
      }

      case '3': {
        console.log(chalk.green('➜ Restore Defaults'))

        console.log('Zalo Theme will be restored to the original settings.')
        const confirm = prompt('[?] Are you sure you want to reset defaults? [Y/n]: ')

        if (confirm === 'Y') {
          await zaDarkPC.restoreDefaults(zaloResDir)
        }
        break
      }

      case '4': {
        console.log(chalk.green('➜ Support'))
        console.log('- Email: ncdai+zadarkpc@penphy.edu.vn')
        console.log('- Messenger: m.me/iamncdai')
        break
      }

      default: {
        console.log(chalk.green('Thank you so much!'))
        console.log(chalk.green('Goodbye ✌️'))
        break
      }
    }
    console.log('')
  } catch (error) {
    console.log(chalk.redBright(error.message))
  }
})()
