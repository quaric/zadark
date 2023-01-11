const axios = require('axios').default

const uploadPackage = async ({ accessToken, itemID, binaryData }) => {
  const config = {
    method: 'put',
    url: `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${itemID}`,
    headers: {
      'x-goog-api-version': '2',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/zip'
    },
    data: binaryData
  }

  const response = await axios(config)

  return response.data
}

module.exports = {
  uploadPackage
}
