const chalk = require('chalk')
const childProcess = require('child_process')

const log = (...args) => console.log(args.join(' '))
const logDebug = (...args) => process.env.NODE_ENV === 'development' ? log(chalk.gray(...args)) : null
const logError = (...args) => console.log(chalk.redBright(args.join(' ')))

const open = (url) => {
  const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open')
  childProcess.exec(start + ' ' + url)
}

module.exports = {
  log,
  logDebug,
  logError,
  open
}
