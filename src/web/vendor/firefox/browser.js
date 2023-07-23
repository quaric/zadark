/*
  ZaDark – Zalo Dark Mode
  Firefox Extension
  Made by Quaric

  ! This file must use VanillaJS
*/

(function (global) {
  const ZaDarkBrowser = {
    name: 'Firefox',

    initClassNames: () => {
      document.body.classList.add('zadark', 'zadark-web', 'zadark-firefox')
    },

    getManifest: () => {
      return browser.runtime.getManifest()
    },

    getURL: (path) => {
      return browser.runtime.getURL(path)
    },

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.get({
          theme: 'dark',
          fontFamily: 'Open Sans',
          fontSize: 'medium',

          enabledHideLatestMessage: false,
          enabledHideConvAvatar: false,
          enabledHideConvName: false,
          enabledHideThreadChatMessage: false,

          enabledBlockTyping: false,
          enabledBlockDelivered: false,
          enabledBlockSeen: false,

          useHotkeys: true,
          knownVersion: ''
        }, (items) => {
          resolve(items)
        })
      })
    },

    saveExtensionSettings: (items) => {
      return browser.storage.sync.set(items)
    },

    getZaloTabs: async () => {
      const tabs = await browser.tabs.query({
        url: ['*://chat.zalo.me/*'],
        currentWindow: true
      })
      return tabs
    },

    sendMessage: (params) => {
      return browser.runtime.sendMessage(params)
    },

    sendMessage2Tab: async function (tabId, action, payload) {
      if (!tabId) {
        return
      }

      await browser.tabs.sendMessage(tabId, {
        action,
        payload
      })
    },

    sendMessage2ZaloTabs: async function (action, payload) {
      const tabs = await this.getZaloTabs()
      tabs.forEach((tab) => {
        this.sendMessage2Tab(tab.id, action, payload)
      })
    },

    addMessageListener: (callback) => {
      browser.runtime.onMessage.addListener(callback)
    }
  }

  global.ZaDarkBrowser = ZaDarkBrowser
})(this)
