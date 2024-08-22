const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const crossSpawn = require('cross-spawn')
const { execSync } = require('child_process')

const { IS_MAC, IS_WIN } = require('./constants')

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
 * Copy a directory recursively
 * @param {string} src - The source directory
 * @param {string} dest - The destination directory
 * @returns {void}
 */
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

/**
 * Copy a directory recursively asynchronously
 * @param {string} src - The source directory
 * @param {string} dest - The destination directory
 * @returns {Promise<void>}
 */
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

/**
 * Copy a directory to another directory
 * @param {string} sourceDir - The source directory
 * @param {string} destDir - The destination directory
 * @returns {void}
 * @throws {Error} - Throws error if the platform is not supported
 */
function copyDirectory (sourceDir, destDir) {
  if (IS_WIN) {
    // Windows: use xcopy command
    execSync(`xcopy /E /I /Y "${sourceDir}" "${destDir}"`, { stdio: 'inherit' })
    return
  }

  if (IS_MAC) {
    // macOS: use ditto command
    execSync(`ditto "${sourceDir}" "${destDir}"`, { stdio: 'inherit' })
    return
  }

  throw new Error('Unsupported platform')
}

module.exports = {
  print,
  printDebug,
  printError,
  clearScreen,

  openWebsite,

  isFile,
  isDirectory,

  copyRecursiveSync,
  copyRecursiveAsync,
  copyDirectory,

  killProcess,
  killProcesses
}
