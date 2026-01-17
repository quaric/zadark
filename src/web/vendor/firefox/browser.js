/*
  ZaDark – Zalo Dark Mode
  Firefox Extension
  Made by Quaric

  ! This file must use VanillaJS
*/

(function (global) {
  const ZaDarkBrowser = {
    name: 'Firefox',
    changelogURL: 'https://zadark.com/blog/changelog',

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
          fontSize: '16',
          translateTarget: 'vi',

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

    // Data is stored locally and cleared when the extension is removed.
    // The storage limit is 10 MB (5 MB in Chrome 113 and earlier),
    // but can be increased by requesting the "unlimitedStorage" permission.
    // We recommend using storage.local to store larger amounts of data.
    // ? Ref: https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas
    getExtensionSettingsLocal: (keys = {}) => {
      return new Promise((resolve, reject) => {
        browser.storage.local.get({
          threadChatBg: '',
          ...keys
        }, (items) => {
          resolve(items)
        })
      })
    },
    saveExtensionSettingsLocal: (items) => {
      return browser.storage.local.set(items)
    },
    /**
     * @param {string[]} items
     */
    removeExtensionSettingsLocal: (items) => {
      return browser.storage.local.remove(items)
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
