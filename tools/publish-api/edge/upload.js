const axios = require('axios').default

const uploadPackage = async ({ accessToken, productID, binaryData }) => {
  const config = {
    method: 'post',
    url: `https://api.addons.microsoftedge.microsoft.com/v1/products/${productID}/submissions/draft/package`,
    headers: {
      'Content-Type': 'application/zip',
      Authorization: `Bearer ${accessToken}`
    },
    data: binaryData
  }

  const response = await axios(config)

  return response.headers?.Location
}

const checkUploadPackageStatus = async ({ accessToken, productID, operationID }) => {
  const config = {
    method: 'get',
    url: `https://api.addons.microsoftedge.microsoft.com/v1/products/${productID}/submissions/draft/package/operations/${operationID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }

  const response = await axios(config)

  return response.data
}

module.exports = {
  uploadPackage,
  checkUploadPackageStatus
}
