/*
  ZaDark – Zalo Dark Mode
  Safari Extension
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
    browser.tabs.create({ url: 'https://zadark.quaric.com/web/safari' })
    handleLoadRulesets()
  }

  if (details.reason === 'update') {
    handleLoadRulesets()
  }
})

browser.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    const { action, payload } = request

    if (action === MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS) {
      browser.declarativeNetRequest.getEnabledRulesets().then((rulesetIds) => {
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

      browser.storage.sync.set(settings)

      browser.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds,
        disableRulesetIds
      })
    }

    return true
  }
)
