const axios = require('axios').default

const publishPackage = async ({ accessToken, itemID, publishTarget = 'default' }) => {
  const config = {
    method: 'post',
    url: `https://www.googleapis.com/chromewebstore/v1.1/items/${itemID}/publish?publishTarget=${publishTarget}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-goog-api-version': '2',
      'Content-Length': '0'
    }
  }

  const response = await axios(config)

  return response.data
}

module.exports = {
  publishPackage
}
