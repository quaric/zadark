/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.browser = {
    name: 'Chrome',

    initClassNames: () => {
      document.body.classList.add('za-dark', 'za-dark-browser-ext', 'za-dark-chrome')
    },

    getManifest: () => {
      return chrome.runtime.getManifest()
    },

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
          themeMode: 'single',
          userTheme: 'dark_dimmed',
          darkTheme: 'dark_dimmed'
        }, (items) => {
          resolve(items)
        })
      })
    },

    saveExtensionSettings: (items) => {
      chrome.storage.sync.set(items)
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
    }
  }
})(window)
