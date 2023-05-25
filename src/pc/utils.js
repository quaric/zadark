const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const crossSpawn = require('cross-spawn')

const { IS_MAC, IS_WIN, IS_DEV } = require('./constants')

const print = (...args) => console.log(args.join(' '))
const printDebug = (...args) => IS_DEV ? print(chalk.gray(...args)) : null
const printError = (...args) => console.log(chalk.redBright(args.join(' ')))
const clearScreen = () => console.clear()

const open = (url) => {
  const start = (IS_MAC ? 'open' : IS_WIN ? 'start' : 'xdg-open')
  crossSpawn(start, [url])
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

const killProcess = (processId) => {
  const args = IS_MAC ? [processId.toString()] : ['/F', '/PID', processId.toString()]
  const result = crossSpawn.sync(IS_MAC ? 'kill' : 'taskkill', args)
  return result?.status === 0
}

module.exports = {
  print,
  printDebug,
  printError,
  clearScreen,

  open,
  copyRecursiveSync,
  isRoot,

  killProcess
}
