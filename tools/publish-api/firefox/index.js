const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const axios = require('axios').default
const fs = require('fs')
const chalk = require('chalk')
const FormData = require('form-data')

const distUtils = require('../../../dist-util')

dotenv.config()

// Submission Workflow
// The submission workflow is split by the process of uploading the file for validation, and attaching the validated file to a new add-on, or as a new version to an existing add-on.
// 1. The add-on file to be distributed is uploaded via the upload create endpoint, along with the channel, returning an upload uuid.
// 2. The upload detail endpoint can be polled for validation status.
// 3. Once the response has "valid": true, it can be used to create either a new add-on, or a new version of an existing add-on. Sources may be attached if required.
// Ref: https://blog.mozilla.org/addons/2022/03/17/new-api-for-submitting-and-updating-add-ons/

const getJWTToken = () => {
  // https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#access-credentials

  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = {
    iss: process.env.FIREFOX_JWT_ISSUER,
    jti: Math.random().toString(),
    iat: issuedAt,
    exp: issuedAt + 60 * 5 // 5 minutes
  }

  const secret = process.env.FIREFOX_JWT_SECRET // store this securely.
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256' // HMAC-SHA256 signing algorithm
  })

  return token
}

const upload = async () => {
  const filePath = distUtils.getFilePath('FIREFOX')

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filePath} does not exist.`)
  }

  const data = new FormData()
  data.append('upload', fs.createReadStream(filePath))
  data.append('channel', 'listed')

  const config = {
    method: 'post',
    url: 'https://addons.mozilla.org/api/v5/addons/upload/',
    headers: {
      Authorization: `JWT ${getJWTToken()}`,
      ...data.getHeaders()
    },
    data: data,
    timeout: 1000 * 60 * 10 // 10 minutes
  }

  const response = await axios(config)

  return response.data
}

const update = async (uploadId) => {
  const data = JSON.stringify({
    upload: uploadId
  })

  const config = {
    method: 'post',
    url: `https://addons.mozilla.org/api/v5/addons/addon/${process.env.FIREFOX_ADDON_ID}/versions/`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getJWTToken()}`
    },
    data: data
  }

  const response = await axios(config)

  return response.data
}

const publishZaDarkForFirefox = async () => {
  try {
    console.log('Step 1. Uploading the add-on file')
    const uploadResponse = await upload()
    console.log(uploadResponse)

    if (!uploadResponse?.valid) {
      throw new Error('Item is not valid')
    }

    const uploadId = uploadResponse.uuid

    console.log('Step 2. Adding a version to an existing add-on')
    const updateResponse = await update(uploadId)
    console.log(updateResponse)
    //
  } catch (error) {
    console.error(chalk.redBright('Error:', error.message))
  }
}

publishZaDarkForFirefox()
