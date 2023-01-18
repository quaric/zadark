const fs = require('fs')
const chalk = require('chalk')

const { getAccessToken } = require('./auth')
const { uploadPackage, checkUploadPackageStatus } = require('./upload')
const { publishPackage, checkPublishPackageStatus } = require('./publish')

const distUtils = require('../../../dist-utils')

const clientID = process.env.EDGE_CLIENT_ID
const clientSecret = process.env.EDGE_CLIENT_SECRET
const productID = process.env.EDGE_PRODUCT_ID
const productDemoURL = process.env.EDGE_DEMO_URL
const productVersion = distUtils.getVersion('EDGE')
const productFilePath = distUtils.getFilePath('EDGE')

const publishZaDarkForEdge = async () => {
  try {
    console.log('Step 1. Get access token')
    const accessToken = await getAccessToken({
      clientID,
      clientSecret
    })

    console.log('Step 2. Upload package')

    const binaryData = fs.readFileSync(productFilePath, 'binary')

    const uploadOperationID = await uploadPackage({
      accessToken,
      productID,
      binaryData
    })
    console.log('Upload operationID', uploadOperationID)

    if (!uploadOperationID) {
      throw new Error('Upload operationID is empty')
    }

    const uploadStatus = await checkUploadPackageStatus({
      accessToken,
      productID,
      operationID: uploadOperationID
    })
    console.log('Upload status', uploadStatus)

    console.log('Step 3. Publish package')

    const publishOperationID = await publishPackage({
      accessToken,
      productID,
      productVersion,
      productDemoURL
    })
    console.log('Publish operationID', publishOperationID)

    if (!publishOperationID) {
      throw new Error('Publish operationID is empty')
    }

    const publishStatus = await checkPublishPackageStatus({
      accessToken,
      productID,
      operationID: publishOperationID
    })
    console.log('Publish status', publishStatus)
    //
  } catch (error) {
    console.log(chalk.redBright('Error:', error.message))
  }
}

publishZaDarkForEdge()
