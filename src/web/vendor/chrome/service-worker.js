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

const handleInitRulesets = async () => {
  const settings = await chrome.storage.sync.get({
    enabledBlockTyping: false,
    enabledBlockDelivered: false,
    enabledBlockSeen: false
  })

  const enableRulesetIds = []
  const disableRulesetIds = []

  RULE_IDS.forEach((ruleId) => {
    const key = SETTINGS_RULE_KEYS[ruleId]
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
    handleInitRulesets()
  }

  if (details.reason === 'update') {
    handleInitRulesets()
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
      const { enableRuleIds, disableRuleIds } = payload
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

      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: payload.enableRuleIds,
        disableRulesetIds: payload.disableRuleIds
      })
    }

    return true
  }
)
