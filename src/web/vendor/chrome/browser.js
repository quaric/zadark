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

    getExtensionSettings: () => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
          theme: 'dark',
          font: 'open-sans',
          enabledBlockTyping: false,
          enabledBlockDelivered: false,
          enabledBlockSeen: false
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

    getEnabledBlockingRuleIds: async () => {
      const rulesetIds = await chrome.declarativeNetRequest.getEnabledRulesets()
      return rulesetIds
    },

    updateEnabledBlockingRuleIds: ({ enableRuleIds = [], disableRuleIds = [] }) => {
      const SETTINGS_RULE_KEYS = {
        rules_block_typing: 'enabledBlockTyping',
        rules_block_delivered: 'enabledBlockDelivered',
        rules_block_seen: 'enabledBlockSeen'
      }

      const settings = {}

      Array.isArray(enableRuleIds) && enableRuleIds.forEach((ruleId) => {
        const key = SETTINGS_RULE_KEYS[ruleId]
        settings[key] = true
      })

      Array.isArray(disableRuleIds) && disableRuleIds.forEach((ruleId) => {
        const key = SETTINGS_RULE_KEYS[ruleId]
        settings[key] = false
      })

      chrome.storage.sync.set(settings)

      return chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: enableRuleIds,
        disableRulesetIds: disableRuleIds
      })
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
    }
  }
})(window)
