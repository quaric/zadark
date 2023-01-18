const axios = require('axios').default
const qs = require('qs')
const dotenv = require('dotenv')

dotenv.config()

const getAccessToken = async ({ clientID, clientSecret }) => {
  const data = qs.stringify({
    client_id: clientID,
    scope: 'https://api.addons.microsoftedge.microsoft.com/.default',
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  })

  const config = {
    method: 'post',
    url: 'https://login.microsoftonline.com/5c9eedce-81bc-42f3-8823-48ba6258b391/oauth2/v2.0/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  }

  const response = await axios(config)

  return response.data?.access_token
}

module.exports = { getAccessToken }
