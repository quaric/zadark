/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

const chalk = require('chalk')
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const crossSpawn = require('cross-spawn')
const psList = require('./ps-list')

const { PLATFORM } = require('./constants')

const log = (...args) => console.log(args.join(' '))
const logDebug = (...args) => process.env.NODE_ENV === 'development' ? log(chalk.gray(...args)) : null
const logError = (...args) => console.log(chalk.redBright(args.join(' ')))

const open = (url) => {
  const start = (PLATFORM === 'darwin' ? 'open' : PLATFORM === 'win32' ? 'start' : 'xdg-open')
  childProcess.exec(start + ' ' + url)
}

const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      )
    })
  } else {
    const destDir = path.dirname(dest)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    // https://github.com/vercel/pkg/issues/639
    const fileContent = fs.readFileSync(src)
    fs.writeFileSync(dest, fileContent)
  }
}

const isRoot = () => {
  return PLATFORM === 'darwin' ? process.getuid && process.getuid() === 0 : false
}

const getProcessIdByName = async (processName) => {
  const processes = await psList()
  const process = processes.find((process) => process.name.toLowerCase() === processName.toLowerCase())
  return process?.pid ?? null
}

const killProcess = (processId) => {
  return new Promise((resolve, reject) => {
    const isWindows = PLATFORM === 'win32'
    const args = isWindows ? ['/F', '/PID', processId.toString()] : [processId.toString()]
    const child = crossSpawn(isWindows ? 'taskkill' : 'kill', args)

    child.on('close', (code) => {
      resolve(code)
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

module.exports = {
  log,
  logDebug,
  logError,

  open,
  copyRecursiveSync,
  isRoot,

  getProcessIdByName,
  killProcess
}
