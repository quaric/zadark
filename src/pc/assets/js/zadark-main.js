/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

/* eslint-disable node/no-callback-literal  */

const { app, session, ipcMain } = require('electron')

app.whenReady().then(() => {
  const _blockSettings = {
    block_typing: false,
    block_delivered: false,
    block_seen: false
  }

  const _settings = {
    theme: 'dark',
    hideLatestMessage: false,
    hideConvAvatarName: false
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
    ]
  }

  session.fromPartition('persist:zalo').webRequest.onBeforeRequest(filter, (details, callback) => {
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

  ipcMain.on('@ZaDark:UPDATE_BLOCK_SETTINGS', (event, payload) => {
    const { enableBlockIds, disableBlockIds } = payload

    Array.isArray(enableBlockIds) && enableBlockIds.forEach((blockId) => {
      _blockSettings[blockId] = true
    })

    Array.isArray(disableBlockIds) && disableBlockIds.forEach((blockId) => {
      _blockSettings[blockId] = false
    })

    if (DEBUG) console.log('ZaDarkPC: @ZaDark:UPDATE_BLOCK_SETTINGS', { payload, _blockSettings })
  })

  ipcMain.on('@ZaDark:UPDATE_SETTINGS', (event, payload) => {
    const validKeys = Object.keys(_settings)

    Object.keys(payload).forEach((key) => {
      if (!validKeys.includes(key)) return
      _settings[key] = payload[key]
    })

    if (DEBUG) console.log('ZaDarkPC: @ZaDark:UPDATE_SETTINGS', { payload, _settings })
  })

  ipcMain.handle('@ZaDark:GET_SETTINGS', () => {
    if (DEBUG) console.log('ZaDarkPC: @ZaDark:GET_SETTINGS', _settings)
    return _settings
  })
})
