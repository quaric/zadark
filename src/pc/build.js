const chalk = require('chalk')
const { compile } = require('nexe')
const path = require('path')

const INPUT_PATH = path.join(__dirname, './index.js')
const RESOURCES_PATH = path.join(__dirname, '../../pc-dist/assets/**/*')

compile({
  input: INPUT_PATH,
  output: path.join(__dirname, '../../pc-dist/release/za-dark-pc'),
  resources: RESOURCES_PATH,
  targets: 'mac-x64-14.15.3',
  silent: true
}).then(() => {
  console.log(chalk.green('macOS Success ✅'))
}).catch((error) => {
  console.log(chalk.redBright('macOS Error ❌'), error.message)
})

compile({
  input: INPUT_PATH,
  output: path.join(__dirname, '../../pc-dist/release/za-dark-pc.exe'),
  resources: RESOURCES_PATH,
  targets: 'windows-x86-14.15.3',
  silent: true
}).then(() => {
  console.log(chalk.green('Windows Success ✅'))
}).catch((error) => {
  console.log(chalk.redBright('Windows Error ❌'), error.message)
})
