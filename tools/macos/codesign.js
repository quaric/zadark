/*
  This program is converted from the Python source code here: https://github.com/txoof/codesign
  Thanks @txoof.
*/

const os = require('os')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const chalk = require('chalk')
const { exec } = require('child_process')

const { ConfigIniParser } = require('config-ini-parser')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getConfig = (configPath) => {
  const parser = new ConfigIniParser()
  const data = fs.readFileSync(configPath, 'utf8')
  parser.parse(data)

  const config = {}

  for (const sectionKey of parser.sections()) {
    config[sectionKey] = {}

    for (const option of parser.items(sectionKey)) {
      config[sectionKey][option[0]] = option[1]
    }
  }

  return config
}

const getOutputPkgFilePath = (config) => {
  return path.join(config.package_details.output_dir, config.package_details.package_name + '.pkg')
}

const runCommand = (args = []) => {
  return new Promise((resolve, reject) => {
    const cmd = Array.isArray(args) ? args.join(' ') : args
    console.log(chalk.magentaBright('BEGIN: RUN COMMAND'))
    console.log(chalk.magentaBright(cmd))

    exec(cmd, (error, stdout, stderr) => {
      console.log('RETURN_CODE', error ? error.code : 0)
      console.log('STDOUT')
      console.log(chalk.gray(stdout || 'Empty'))
      console.log('STDERR')
      console.log(chalk.gray(stderr || 'Empty'))
      console.log(chalk.magentaBright('END: RUN COMMAND'))

      if (error) {
        resolve({ returnCode: error.code, stdout, stderr })
        return
      }

      resolve({ returnCode: 0, stdout, stderr })
    })
  })
}

const sign = (config) => {
  const cmd = [
    'codesign',
    '--deep',
    '--force',
    '--options', 'runtime',
    '--entitlements', config.package_details.entitlements,
    '--sign', config.identification.developer_id_application,
    '--timestamp',
    config.package_details.src
  ]
  return runCommand(cmd)
}

const pkgBuild = async (config) => {
  const TMP_PATH = '.zadark'

  await runCommand(['mkdir', '-p', TMP_PATH])
  await runCommand(['ditto', config.package_details.src, path.join(TMP_PATH, 'ZaDark')])

  const pkgbuildRes = await runCommand([
    'pkgbuild',
    '--identifier', config.package_details.bundle_id,
    '--sign', config.identification.developer_id_installer,
    '--scripts', config.package_details.scripts,
    '--timestamp',
    '--root', TMP_PATH, getOutputPkgFilePath(config),
    '--install-location', config.package_details.install_location,
    '--version', config.package_details.version
  ])

  await runCommand(['rm', '-rf', TMP_PATH])

  return pkgbuildRes
}

const notarize = (config) => {
  const cmd = [
    'xcrun altool',
    '--notarize-app',
    '--primary-bundle-id', config.package_details.bundle_id,
    '--username', config.identification.apple_id,
    '--password', config.identification.apple_password,
    '--asc-provider', config.identification.asc_provider,
    '--file', getOutputPkgFilePath(config)
  ]
  return runCommand(cmd)
}

const checkNotarization = async (config, stdout = '') => {
  const notarizeCheckMax = 5
  let notarizeCheckCount = 0
  let isNotarized = false
  const uuids = []

  for (const line of stdout.split(os.EOL)) {
    if (line.toLowerCase().includes('requestuuid')) {
      const id = line.split('=')
      uuids.push(_.trim(id[1]))
    }
  }

  console.log('UUIDS found', uuids)

  const notarizationInfoCMD = [
    'xcrun altool',
    '--notarization-info', _.first(uuids),
    '--username', config.identification.apple_id,
    '--password', config.identification.apple_password
  ]

  while (!isNotarized) {
    const status = {}
    let success = null

    notarizeCheckCount += 1
    console.log(`Checking notarization status (${notarizeCheckCount} of ${notarizeCheckMax})`)

    const { stdout } = await runCommand(notarizationInfoCMD)

    if (stdout) {
      for (const line of stdout.split(os.EOL)) {
        if (line.toLowerCase().includes('status')) {
          const temp = line.split(':')
          status[_.trim(temp[0]).toLowerCase()] = _.trim(temp[1])
        }
      }

      if (status.status === 'success') {
        success = true
      } else if (status.status === 'invalid') {
        success = false
      } else {
        console.log('Inconclusive notarization status data returned', status)
      }

      if (success === true) {
        console.log('Successfully notarized')
        isNotarized = true
        break
      } else if (success === false) {
        console.log('Notarization failed')
        isNotarized = false
        break
      } else {
        console.log('Notarization not complete')

        if (notarizeCheckCount >= notarizeCheckMax) {
          console.log('Notarization failed')
          break
        }

        const sleepTimer = 60 * 1000 // 60s
        console.log(`Try again in ${sleepTimer / 1000}s`)
        await sleep(sleepTimer)
      }
    }
  }

  return isNotarized
}

const staple = (config) => {
  const pkgFile = getOutputPkgFilePath(config)
  const cmd = `xcrun stapler staple ${pkgFile}`
  return runCommand(cmd)
}

const checkSign = (config) => {
  const cmd = `spctl -a -t open --context context:primary-signature -v "${config.package_details.src}"`
  return runCommand(cmd)
}

const checkSignPkg = (config) => {
  const cmd = `pkgutil --check-signature ${getOutputPkgFilePath(config)}`
  return runCommand(cmd)
}

(async () => {
  const args = process.argv.slice(2)
  const configFilePath = args[0]

  if (!configFilePath) {
    console.log(chalk.redBright('Config file not found.'))
    process.exit(0)
  }

  if (!fs.existsSync(configFilePath)) {
    console.log(chalk.redBright(`${configFilePath} does not exists.`))
    process.exit(0)
  }

  const config = getConfig(configFilePath)

  let runAll = true
  let shouldStop = false

  const signOnly = config.main.sign_only === '1'
  const packageOnly = config.main.package_only === '1'
  const notarizeOnly = config.main.notarize_only === '1'
  const stapleOnly = config.main.staple_only === '1'

  if (signOnly || packageOnly || notarizeOnly || stapleOnly) {
    runAll = false
  }

  if (signOnly || runAll) {
    console.log('[Signing...]')
    const signRes = await sign(config)
    if (signRes.returnCode > 0) {
      shouldStop = true
    }
    await checkSign(config)
  }

  if ((packageOnly || runAll) && !shouldStop) {
    console.log('[Packaging...]')
    const pkgBuildRes = await pkgBuild(config)
    if (pkgBuildRes.returnCode > 0) {
      shouldStop = true
    }
  }

  if ((notarizeOnly || runAll) && !shouldStop) {
    console.log('[Notarizing...]')

    const notarizeRes = await notarize(config)

    if (notarizeRes.returnCode > 0) {
      shouldStop = true
    } else {
      const checkNotarizationRes = await checkNotarization(config, notarizeRes.stdout)
      if (checkNotarizationRes) {
        console.log('Notaization process at Apple completed')
      } else {
        console.log('Notariztion process did not complete or was inconclusive')
        console.log('Check manually with: ...')
        const notarizationHistoryCMD = [
          'xcrun altool \\',
          '--notarization-history 0 \\',
          `--username "${config.identification.apple_id}" \\`,
          `--password "${config.identification.apple_password}" \\`,
          `--asc-provider "${config.identification.asc_provider}"`
        ].join(os.EOL)
        console.log(notarizationHistoryCMD)
        shouldStop = true
      }
    }
  }

  if ((stapleOnly || runAll) && !shouldStop) {
    console.log('[Stapling...]')
    const stapleRes = await staple(config)
    if (stapleRes.returnCode > 0) {
      shouldStop = true
    }
    await checkSignPkg(config)
  }
})()
