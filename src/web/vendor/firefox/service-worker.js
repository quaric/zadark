/*
  ZaDark – Zalo Dark Mode
  Firefox Extension
  Made by Quaric
*/

const MSG_ACTIONS = {
  GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
  UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS'
}

const RULE_IDS = ['rules_block_typing', 'rules_block_delivered', 'rules_block_seen']

const SETTINGS_RULE_KEYS = {
  rules_block_typing: 'enabledBlockTyping',
  rules_block_delivered: 'enabledBlockDelivered',
  rules_block_seen: 'enabledBlockSeen'
}

const UNINSTALL_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdLonVbx-IavimDRneKuUhtMox4vDbyu35tB6uzQG8FGJFbUg/viewform?usp=pp_url&entry.454875478=Firefox'

const handleLoadRulesets = async () => {
  const settings = await browser.storage.sync.get({
    enabledBlockTyping: false,
    enabledBlockDelivered: false,
    enabledBlockSeen: false
  })

  const enableRulesetIds = []
  const disableRulesetIds = []

  RULE_IDS.forEach((ruleId) => {
    const key = SETTINGS_RULE_KEYS[ruleId]

    if (!key) return

    if (settings[key]) {
      enableRulesetIds.push(ruleId)
    } else {
      disableRulesetIds.push(ruleId)
    }
  })

  browser.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds,
    disableRulesetIds
  })
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: 'https://zadark.com/web/firefox' })
    browser.runtime.setUninstallURL(UNINSTALL_URL)
    handleLoadRulesets()
  }

  if (details.reason === 'update') {
    browser.runtime.setUninstallURL(UNINSTALL_URL)
    handleLoadRulesets()
  }
})

browser.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    const { action, payload } = request

    if (action === MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS) {
      return browser.declarativeNetRequest.getEnabledRulesets()
    }

    if (action === MSG_ACTIONS.UPDATE_ENABLED_BLOCKING_RULE_IDS) {
      const { enableRulesetIds, disableRulesetIds } = payload

      const settings = {}

      Array.isArray(enableRulesetIds) && enableRulesetIds.forEach((ruleId) => {
        const key = SETTINGS_RULE_KEYS[ruleId]
        if (key) settings[key] = true
      })

      Array.isArray(disableRulesetIds) && disableRulesetIds.forEach((ruleId) => {
        const key = SETTINGS_RULE_KEYS[ruleId]
        if (key) settings[key] = false
      })

      browser.storage.sync.set(settings)

      browser.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds,
        disableRulesetIds
      })

      return Promise.resolve(true)
    }

    return false
  }
)
