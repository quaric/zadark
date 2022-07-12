/*
  ZaDark – Zalo Dark Mode
  Microsoft Edge Extension
  Made by NCDAi Studio

  ! This file must use VanillaJS
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.browser = {
    name: 'Edge',

    initClassNames: () => {
      document.body.classList.add('zadark', 'zadark-browser-ext', 'zadark-edge')
    },

    getManifest: () => {
      return chrome.runtime.getManifest()
    },

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
          themeMode: 'single',
          userTheme: 'dark_dimmed',
          darkTheme: 'dark_dimmed',
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
      chrome.scripting.executeScript({
        target: { tabId },
        files: [file]
      })
    },

    getZaloTabs: async () => {
      const tabs = await chrome.tabs.query({
        url: ['*://chat.zalo.me/*'],
        currentWindow: true
      })
      return tabs
    },

    createTab: ({ url }) => {
      chrome.tabs.create({ url })
    },

    getEnabledBlockingRuleIds: async () => {
      const rulesetIds = await chrome.declarativeNetRequest.getEnabledRulesets()
      return rulesetIds
    },

    updateEnabledBlockingRuleIds: ({ enableRuleIds = [], disableRuleIds = [] }) => {
      return chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: enableRuleIds,
        disableRulesetIds: disableRuleIds
      })
    }
  }
})(window)
