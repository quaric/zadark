/*
  ZaDark – Zalo Dark Mode
  Chrome Extension
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

const UNINSTALL_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdLonVbx-IavimDRneKuUhtMox4vDbyu35tB6uzQG8FGJFbUg/viewform?usp=pp_url&entry.454875478=Chrome'

const handleLoadRulesets = async () => {
  const settings = await chrome.storage.sync.get({
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

  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds,
    disableRulesetIds
  })
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://zadark.quaric.com/web/chrome' })
    chrome.runtime.setUninstallURL(UNINSTALL_URL)
    handleLoadRulesets()
  }

  if (details.reason === 'update') {
    chrome.runtime.setUninstallURL(UNINSTALL_URL)
    handleLoadRulesets()
  }
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    const { action, payload } = request

    if (action === MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS) {
      chrome.declarativeNetRequest.getEnabledRulesets().then((rulesetIds) => {
        sendResponse(rulesetIds)
      })
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

      chrome.storage.sync.set(settings)

      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds,
        disableRulesetIds
      })
    }

    return true
  }
)
