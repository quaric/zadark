/*
  ZaDark – Zalo Dark Mode
  Chrome Extension
  Made by Quaric

  ! This file must use VanillaJS
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.browser = {
    name: 'Chrome',

    initClassNames: () => {
      document.body.classList.add('zadark', 'zadark-web', 'zadark-chrome')
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
          font: 'open-sans',
          fontSize: 'medium',
          enabledHideThreadChatMessage: false,
          enabledBlockTyping: false,
          enabledBlockDelivered: false,
          enabledBlockSeen: false,
          enabledBlockOnline: false,
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
})(window)
