const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const crossSpawn = require('cross-spawn')

const { IS_MAC, IS_DEV, CONFIG_FILE_PATH } = require('./constants')

const print = (...args) => console.log(args.join(' '))
const printDebug = (...args) => IS_DEV ? print(chalk.gray(...args)) : null
const printError = (...args) => console.log(chalk.redBright(args.join(' ')))
const clearScreen = () => console.clear()

const openWebsite = (url) => {
  const cmd = IS_MAC ? 'open' : 'start'
  const _url = `"${url}"`
  const args = IS_MAC ? [_url] : ['""', _url]
  crossSpawn(cmd, args, { shell: true })
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
    return
  }

  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  // https://github.com/vercel/pkg/issues/639
  const fileContent = fs.readFileSync(src)
  fs.writeFileSync(dest, fileContent)
}

const isRoot = () => {
  return IS_MAC ? process.getuid && process.getuid() === 0 : false
}

const killProcess = (pid) => {
  const args = IS_MAC ? [pid.toString()] : ['/F', '/PID', pid.toString()]
  const result = crossSpawn.sync(IS_MAC ? 'kill' : 'taskkill', args)
  return result?.status === 0
}

const killProcesses = (processIds = []) => {
  processIds.forEach((pid) => killProcess(pid))
}

const saveUserSettings = (settings) => {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(settings))
    return true
  } catch (err) {
    return false
  }
}

const loadUserSettings = () => {
  try {
    const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    return {}
  }
}

module.exports = {
  print,
  printDebug,
  printError,
  clearScreen,

  openWebsite,
  copyRecursiveSync,
  isRoot,

  killProcess,
  killProcesses,

  saveUserSettings,
  loadUserSettings
}
