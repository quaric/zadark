/*
  ZaDark – Zalo Dark Mode
  Opera Extension
  Made by NCDAi Studio

  ! This file must use VanillaJS
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.browser = {
    name: 'Opera',

    initClassNames: () => {
      document.body.classList.add('zadark', 'zadark-web', 'zadark-opera')
    },

    getManifest: () => {
      return chrome.runtime.getManifest()
    },

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
          themeMode: 'custom',
          customTheme: 'dark',
          isReceiveUpdateNoti: true
        }, (items) => {
          resolve(items)
        })
      })
    },

    saveExtensionSettings: (items) => {
      return chrome.storage.sync.set(items)
    },

    executeScript: (tabId, file) => {
      chrome.tabs.executeScript(tabId, { file })
    },

    getZaloTabs: async () => {
      return new Promise((resolve) => {
        chrome.tabs.query({
          url: ['*://chat.zalo.me/*'],
          currentWindow: true
        }, (tabs) => {
          resolve(tabs)
        })
      })
    },

    createTab: ({ url }) => {
      chrome.tabs.create({ url })
    },

    getEnabledBlockingRuleIds: () => {
      return new Promise((resolve, reject) => {
        chrome.declarativeNetRequest.getEnabledRulesets((rulesetIds) => {
          resolve(rulesetIds)
        })
      })
    },

    updateEnabledBlockingRuleIds: ({ enableRuleIds = [], disableRuleIds = [] }) => {
      return chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: enableRuleIds,
        disableRulesetIds: disableRuleIds
      })
    }
  }
})(window)
