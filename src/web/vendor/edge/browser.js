/*
  ZaDark – Zalo Dark Mode
  Microsoft Edge Extension
  Made by Quaric

  ! This file must use VanillaJS
*/

(function (global) {
  const ZaDarkBrowser = {
    name: 'Edge',
    changelogURL: 'https://zadark.quaric.com/blog/changelog',

    initClassNames: () => {
      document.body.classList.add('zadark', 'zadark-web', 'zadark-edge')
    },

    getManifest: () => {
      return chrome.runtime.getManifest()
    },

    getURL: (path) => {
      return chrome.runtime.getURL(path)
    },

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
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
      return chrome.storage.sync.set(items)
    },

    getZaloTabs: async () => {
      const tabs = await chrome.tabs.query({
        url: ['*://chat.zalo.me/*'],
        currentWindow: true
      })
      return tabs
    },

    sendMessage: (params) => {
      return chrome.runtime.sendMessage(params)
    },

    sendMessage2Tab: async function (tabId, action, payload) {
      if (!tabId) {
        return
      }

      await chrome.tabs.sendMessage(tabId, {
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
      chrome.runtime.onMessage.addListener(callback)
    }
  }

  global.ZaDarkBrowser = ZaDarkBrowser
})(this)
