const chalk = require('chalk')
const fs = require('fs-extra')
const crossSpawn = require('cross-spawn')

const { IS_MAC } = require('./constants')

const print = (...args) => console.log(args.join(' '))
const printDebug = (...args) => print(chalk.gray(...args))
const printError = (...args) => console.log(chalk.redBright(args.join(' ')))
const clearScreen = () => console.clear()

/**
 * Open a website in the default browser
 * @param {string} url - The URL to open
 * @returns {void}
*/
const openWebsite = (url) => {
  const cmd = IS_MAC ? 'open' : 'start'
  const _url = `"${url}"`
  const args = IS_MAC ? [_url] : ['""', _url]
  crossSpawn(cmd, args, { shell: true })
}

/**
 * Check if the path is a file
 * @param {string} p - The path to check
 * @returns {boolean} - Returns true if the path is a file, otherwise false
 * @throws {Error} - Throws error if the path is invalid
 */
const isFile = (p) => {
  try {
    const stats = fs.statSync(p)
    return stats.isFile()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      throw error
    }
  }
}

/**
 * Check if the path is a directory
 * @param {string} p - The path to check
 * @returns {boolean} - Returns true if the path is a directory, otherwise false
 * @throws {Error} - Throws error if the path is invalid
* */
const isDirectory = (p) => {
  try {
    const stats = fs.statSync(p)
    return stats.isDirectory()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      throw error
    }
  }
}

/**
 * Kill a process by its PID
 * @param {number} pid - The process ID
 * @returns {boolean} - Returns true if the process was killed, otherwise false
 */
const killProcess = (pid) => {
  try {
    const args = IS_MAC ? [pid.toString()] : ['/F', '/PID', pid.toString()]
    const result = crossSpawn.sync(IS_MAC ? 'kill' : 'taskkill', args)
    return result?.status === 0
  } catch (error) {
    return false
  }
}

/**
 * Kill multiple processes by their PIDs
 * @param {number[]} processIds - An array of process IDs
 * @returns {void}
 */
const killProcesses = (processIds = []) => {
  processIds.forEach((pid) => killProcess(pid))
}

module.exports = {
  print,
  printDebug,
  printError,
  clearScreen,

  openWebsite,

  isFile,
  isDirectory,

  killProcess,
  killProcesses
}
