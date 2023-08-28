/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

/* eslint-disable node/no-callback-literal  */

const { app, session } = require('electron')

const getFilterUrls = (domains = [], paths = []) => {
  return paths.reduce((prevUrls, path) => {
    const nextUrls = domains.map((domain) => [domain, path].join(''))
    return [...prevUrls, ...nextUrls]
  }, [])
}

const PARTITION_NAME = 'persist:zalo'

const BLOCK_STORAGE_KEYS = {
  block_typing: '@ZaDark:ENABLED_BLOCK_TYPING',
  block_delivered: '@ZaDark:ENABLED_BLOCK_DELIVERED',
  block_seen: '@ZaDark:ENABLED_BLOCK_SEEN'
}

const FILTER_DOMAINS = [
  '*://*.zalo.me',
  '*://*.zaloapp.com'
]
const FILTER_PATHS = [
  // Typing
  '/api/message/typing?*',
  '/api/group/typing?*',

  // Delivered
  '/api/message/deliveredv2?*',
  '/api/e2ee/pc/t/message/delivered?*',
  '/api/group/deliveredv2?*',

  // Seen
  '/api/message/seenv2?*',
  '/api/group/seenv2?*'
]

const BLOCK_FILTER = {
  urls: getFilterUrls(FILTER_DOMAINS, FILTER_PATHS)
}

app.whenReady().then(() => {
  const _blockSettings = {
    block_typing: false,
    block_delivered: false,
    block_seen: false
  }

  session.fromPartition(PARTITION_NAME).webRequest.onBeforeRequest(BLOCK_FILTER, (details, callback) => {
    // Typing
    if (_blockSettings.block_typing && (details.url.includes('api/message/typing') || details.url.includes('api/group/typing'))) {
      if (DEBUG) console.log('ZaDarkPC: block_typing', details.url)
      callback({ cancel: true })
    }

    // Delivered
    if (_blockSettings.block_delivered && (details.url.includes('api/message/deliveredv2') || details.url.includes('api/e2ee/pc/t/message/delivered') || details.url.includes('api/group/deliveredv2'))) {
      if (DEBUG) console.log('ZaDarkPC: block_delivered', details.url)
      callback({ cancel: true })
    }

    // Seen
    if (_blockSettings.block_seen && (details.url.includes('api/message/seenv2') || details.url.includes('api/group/seenv2'))) {
      if (DEBUG) console.log('ZaDarkPC: block_seen', details.url)
      callback({ cancel: true })
    }

    callback({ cancel: false })
  })

  session.fromPartition(PARTITION_NAME).cookies.get({ domain: 'zadark.quaric.com' })
    .then((cookies = []) => {
      if (DEBUG) console.log('ZaDarkPC: Cookies/zadark.quaric.com', cookies)

      cookies.forEach((cookie) => {
        // Typing
        if (cookie.name === BLOCK_STORAGE_KEYS.block_typing) {
          _blockSettings.block_typing = cookie.value === 'true'
        }

        // Delivered
        if (cookie.name === BLOCK_STORAGE_KEYS.block_delivered) {
          _blockSettings.block_delivered = cookie.value === 'true'
        }

        // Seen
        if (cookie.name === BLOCK_STORAGE_KEYS.block_seen) {
          _blockSettings.block_seen = cookie.value === 'true'
        }
      })

      if (DEBUG) console.log('ZaDarkPC: _blockSettings', _blockSettings)
    })
})
