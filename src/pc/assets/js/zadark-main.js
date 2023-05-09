/* eslint-disable node/no-callback-literal  */

const { app, session, ipcMain } = require('electron')

app.whenReady().then(() => {
  if (DEBUG) {
    console.log('ZaDarkPC: Debug mode is ON')
  }

  const blockSettings = {
    block_typing: false,
    block_delivered: false,
    block_seen: false,
    block_online: false
  }

  const filter = {
    urls: [
      // Typing
      '*://*.zalo.me/api/message/typing?*',
      '*://*.zalo.me/api/group/typing?*',

      // Delivered
      '*://*.zalo.me/api/message/deliveredv2?*',
      '*://*.zalo.me/api/e2ee/pc/t/message/delivered?*',
      '*://*.zalo.me/api/group/deliveredv2?*',

      // Seen
      '*://*.zalo.me/api/message/seenv2?*',
      '*://*.zalo.me/api/group/seenv2?*'

      // Online
      // '*://*.zalo.me/api/social/profile/ping?*'
    ]
  }

  session.fromPartition('persist:zalo').webRequest.onBeforeRequest(filter, (details, callback) => {
    // Typing
    if (blockSettings.block_typing && (details.url.includes('api/message/typing') || details.url.includes('api/group/typing'))) {
      if (DEBUG) console.log('ZaDarkPC: block_typing', details.url)
      callback({ cancel: true })
    }

    // Delivered
    if (blockSettings.block_delivered && (details.url.includes('api/message/deliveredv2') || details.url.includes('api/e2ee/pc/t/message/delivered') || details.url.includes('api/group/deliveredv2'))) {
      if (DEBUG) console.log('ZaDarkPC: block_delivered', details.url)
      callback({ cancel: true })
    }

    // Seen
    if (blockSettings.block_seen && (details.url.includes('api/message/seenv2') || details.url.includes('api/group/seenv2'))) {
      if (DEBUG) console.log('ZaDarkPC: block_seen', details.url)
      callback({ cancel: true })
    }

    // Online
    // if (blockSettings.block_online && details.url.includes('api/social/profile/ping')) {
    //   if (DEBUG) console.log('ZaDarkPC: block_online', details.url)
    //   callback({ cancel: true })
    // }

    // Allow
    callback({ cancel: false })
  })

  ipcMain.on('@ZaDark:UPDATE_BLOCK_SETTINGS', (event, payload) => {
    if (DEBUG) console.log('ZaDarkPC: @ZaDark:UPDATE_BLOCK_SETTINGS', payload)

    const { enableBlockIds, disableBlockIds } = payload

    Array.isArray(enableBlockIds) && enableBlockIds.forEach((rule) => {
      blockSettings[rule] = true
    })

    Array.isArray(disableBlockIds) && disableBlockIds.forEach((rule) => {
      blockSettings[rule] = false
    })
  })
})
