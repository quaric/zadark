const axios = require('axios').default

const publishPackage = async ({ accessToken, productID, productVersion, productDemoURL }) => {
  const data = JSON.stringify({
    notes: `ZaDark is an open source extension that helps you enable Dark Mode for Zalo Web. Zalo Web is a 3rd party messaging software, so I cannot provide an account for you to test this extension. Instead I provide a video that demonstrates the current version of my extension (v${productVersion}): ${productDemoURL}.`
  })

  const config = {
    method: 'post',
    url: `https://api.addons.microsoftedge.microsoft.com/v1/products/${productID}/submissions`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: data
  }

  const response = await axios(config)

  return response.headers?.Location
}

const checkPublishPackageStatus = async ({ accessToken, productID, operationID }) => {
  const config = {
    method: 'get',
    url: `https://api.addons.microsoftedge.microsoft.com/v1/products/${productID}/submissions/operations/${operationID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }

  const response = await axios(config)

  return response.data
}

module.exports = {
  publishPackage,
  checkPublishPackageStatus
}
