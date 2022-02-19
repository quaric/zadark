/* eslint-disable no-unused-vars, camelcase */

/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.browser = {
    name: 'Firefox',

    initClassNames: () => {
      document.body.classList.add('za-dark', 'za-dark-browser-ext', 'za-dark-firefox')
    },

    getManifest: () => {
      return browser.runtime.getManifest()
    },

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        browser.storage.sync.get({
          themeMode: 'single',
          userTheme: 'dark_dimmed',
          darkTheme: 'dark_dimmed'
        }, (items) => {
          resolve(items)
        })
      })
    },

    saveExtensionSettings: (items) => {
      browser.storage.sync.set(items)
    },

    executeScript: (tabId, file) => {
      browser.tabs.executeScript(tabId, { file })
    },

    getZaloTabs: async () => {
      const tabs = await browser.tabs.query({
        url: ['*://chat.zalo.me/*'],
        currentWindow: true
      })
      return tabs
    },

    createTab: ({ url }) => {
      browser.tabs.create({ url })
    }
  }
})(window)
