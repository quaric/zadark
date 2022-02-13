/*
  ZaDark – Best Dark Theme for Zalo
  Made by NCDAi Studio
*/

const chalk = require('chalk')
const path = require('path')
const { compile } = require('nexe')

const { zipDir } = require('../../utils')
const packageJSON = require('./package.json')

const INPUT_PATH = path.join(__dirname, './index.js')
const RESOURCES_PATH = path.join(__dirname, '../../pc-dist/assets/**/*')
const VERSION = packageJSON.version

const OUTPUT_ROOT_DIR = '../../build/pc'
const MACOS_FILE_NAME = `ZaDarkPC-macOS-${VERSION}`
const WINDOWS_FILE_NAME = `ZaDarkPC-Windows-${VERSION}`

// macOS
compile({
  input: INPUT_PATH,
  output: path.join(__dirname, `${OUTPUT_ROOT_DIR}/${MACOS_FILE_NAME}/${MACOS_FILE_NAME}.command`),
  resources: RESOURCES_PATH,
  targets: 'mac-x64-14.15.3',
  silent: true
}).then(() => {
  console.log(chalk.green('macOS: Compile Success ✅'))

  zipDir({
    src: path.join(__dirname, `${OUTPUT_ROOT_DIR}/${MACOS_FILE_NAME}`),
    dest: path.join(__dirname, OUTPUT_ROOT_DIR),
    fileName: `${MACOS_FILE_NAME}`
  })
    .then(() => {
      console.log(chalk.green('macOS: ZIP Success ✅'))
    })
    .catch((error) => {
      console.log(chalk.redBright('macOS: ZIP Error ✅'), error.message)
    })
}).catch((error) => {
  console.log(chalk.redBright('macOS: Compile Error ❌'), error.message)
})

// Windows
compile({
  input: INPUT_PATH,
  output: path.join(__dirname, `${OUTPUT_ROOT_DIR}/${WINDOWS_FILE_NAME}/${WINDOWS_FILE_NAME}.exe`),
  resources: RESOURCES_PATH,
  targets: 'windows-x86-14.15.3',
  silent: true
}).then(() => {
  console.log(chalk.green('Windows: Compile Success ✅'))

  zipDir({
    src: path.join(__dirname, `${OUTPUT_ROOT_DIR}/${WINDOWS_FILE_NAME}`),
    dest: path.join(__dirname, OUTPUT_ROOT_DIR),
    fileName: `${WINDOWS_FILE_NAME}`
  })
    .then(() => {
      console.log(chalk.green('Windows: ZIP Success ✅'))
    })
    .catch((error) => {
      console.log(chalk.redBright('Windows: ZIP Error ✅'), error.message)
    })
}).catch((error) => {
  console.log(chalk.redBright('Windows: Compile Error ❌'), error.message)
})
