const axios = require('axios').default
const qs = require('qs')
const dotenv = require('dotenv')

dotenv.config()

const getRequestPermissionURL = ({ clientID }) => {
  return `https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${clientID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`
}

const getAccessToken = async ({ clientID, clientSecret, requestTokenCode }) => {
  const data = qs.stringify({
    client_id: clientID,
    client_secret: clientSecret,
    code: requestTokenCode,
    grant_type: 'authorization_code',
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
  })

  const config = {
    method: 'post',
    url: 'https://accounts.google.com/o/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  }

  const response = await axios(config)

  return response.data?.access_token
}

module.exports = {
  getRequestPermissionURL,
  getAccessToken
}
