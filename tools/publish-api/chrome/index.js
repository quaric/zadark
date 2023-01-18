const fs = require('fs')
const chalk = require('chalk')

const { getAccessToken } = require('./auth')
const { uploadPackage } = require('./upload')
const { publishPackage } = require('./publish')

const distUtils = require('../../../dist-utils')

const clientID = process.env.CHROME_CLIENT_ID
const clientSecret = process.env.CHROME_CLIENT_SECRET
const requestTokenCode = process.env.CHROME_REQUEST_TOKEN_CODE
const itemID = process.env.CHROME_ITEM_ID
const productFilePath = distUtils.getFilePath('EDGE')

const publishZaDarkForChrome = async () => {
  try {
    console.log('Step 1. Get access token')
    const accessToken = await getAccessToken({
      clientID,
      clientSecret,
      requestTokenCode
    })

    console.log('Step 2. Upload package')

    const binaryData = fs.readFileSync(productFilePath, 'binary')

    const uploadResponse = await uploadPackage({
      accessToken,
      itemID,
      binaryData
    })
    console.log(uploadResponse)

    console.log('Step 3. Publish package')

    const publishResponse = await publishPackage({
      accessToken,
      itemID
    })
    console.log(publishResponse)
    //
  } catch (error) {
    console.log(chalk.redBright('Error:', error.message))
  }
}

publishZaDarkForChrome()
