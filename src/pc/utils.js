const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const crossSpawn = require('cross-spawn')

const { IS_MAC } = require('./constants')

const print = (...args) => console.log(args.join(' '))
const printDebug = (...args) => print(chalk.gray(...args))
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

const fsPromises = fs.promises

const copyRecursiveAsync = async (src, dest) => {
  const stats = await fsPromises.stat(src)
  const isDirectory = stats.isDirectory()

  if (isDirectory) {
    await fsPromises.mkdir(dest, { recursive: true })
    const files = await fsPromises.readdir(src)
    await Promise.all(files.map(async (childItemName) => {
      await copyRecursiveAsync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      )
    }))
  } else {
    const destDir = path.dirname(dest)
    if (!(await fsPromises.access(destDir))) {
      await fsPromises.mkdir(destDir, { recursive: true })
    }
    const fileContent = await fsPromises.readFile(src)
    await fsPromises.writeFile(dest, fileContent)
  }
}

const killProcess = (pid) => {
  try {
    const args = IS_MAC ? [pid.toString()] : ['/F', '/PID', pid.toString()]
    const result = crossSpawn.sync(IS_MAC ? 'kill' : 'taskkill', args)
    return result?.status === 0
  } catch (error) {
    return false
  }
}

const killProcesses = (processIds = []) => {
  processIds.forEach((pid) => killProcess(pid))
}

module.exports = {
  print,
  printDebug,
  printError,
  clearScreen,

  openWebsite,
  copyRecursiveSync,
  copyRecursiveAsync,

  killProcess,
  killProcesses
}
