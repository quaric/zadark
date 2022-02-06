/*
  ZaDark – Best Dark Theme for Zalo
  Made by NCDAi Studio
*/

const path = require('path')
const chalk = require('chalk')
const { zipDir } = require('../../utils')
const manifest = require('../../chrome-ext-dist/manifest.json')

zipDir({
  src: path.join(__dirname, '../../chrome-ext-dist'),
  dest: path.join(__dirname, '../../build/chrome-ext'),
  fileName: `ZaDarkChromeExtension-${manifest.version}`
})
  .then(() => {
    console.log(chalk.green('Chrome Extension ZIP Success ✅'))
  })
  .catch((error) => {
    console.log(chalk.redBright('ZIP Error ❌'), error.message)
  })
