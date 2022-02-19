const chalk = require('chalk')

const log = (...args) => console.log(args.join(' '))
const logDebug = (...args) => process.env.NODE_ENV === 'development' ? log(chalk.gray(...args)) : null
const logError = (...args) => console.log(chalk.redBright(args.join(' ')))

module.exports = {
  log,
  logDebug,
  logError
}
