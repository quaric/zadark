const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const zipDir = ({ src, dest, fileName }) => {
  return new Promise((resolve, reject) => {
    if (!src || !dest || !fileName) {
      reject(new Error('src, dest and fileName are required.'))
    }

    if (!fs.existsSync(src)) {
      reject(new Error(src + ' doesn\'t exist.'))
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }

    const output = fs.createWriteStream(path.join(dest, `${fileName}.zip`))
    output.on('close', resolve)
    output.on('end', resolve)

    const archive = archiver('zip')
    archive.on('error', reject)
    archive.on('warning', console.warn)
    archive.pipe(output)

    archive.directory(src, false).finalize()
  })
}

module.exports = {
  zipDir
}
