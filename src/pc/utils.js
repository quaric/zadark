const chalk = require('chalk')
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const log = (...args) => console.log(args.join(' '))
const logDebug = (...args) => process.env.NODE_ENV === 'development' ? log(chalk.gray(...args)) : null
const logError = (...args) => console.log(chalk.redBright(args.join(' ')))

const open = (url) => {
  const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open')
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

module.exports = {
  log,
  logDebug,
  logError,
  open,
  copyRecursiveSync
}
