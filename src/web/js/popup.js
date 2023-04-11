/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

const versionElName = '#js-ext-version'
const selectThemeElName = '#js-select-theme input:radio[name="theme"]'
const selectFontElName = '#js-select-font'
const manifestData = window.zadark.browser.getManifest()

const MSG_ACTIONS = {
  GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
  UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS'
}

$(versionElName).html(`Phiên bản ${manifestData.version}`)

window.zadark.utils.refreshPageTheme()
window.zadark.utils.refreshPageFont()
window.zadark.browser.getExtensionSettings().then(({ theme, font }) => {
  $(selectThemeElName).filter(`[value="${theme}"]`).attr('checked', true)
  $(selectFontElName).val(font)
})

$(selectThemeElName).on('change', async function () {
  const theme = $(this).val()

  await window.zadark.browser.saveExtensionSettings({ theme })

  // Set popup theme
  window.zadark.utils.refreshPageTheme()

  // Set page theme for all Zalo tabs
  window.zadark.browser.sendMessage2ZaloTabs('@ZaDark:CHANGE_THEME', { theme })
})

$(selectFontElName).on('change', async function () {
  const font = $(this).val()

  await window.zadark.browser.saveExtensionSettings({ font })

  // Set page font for all Zalo tabs
  window.zadark.browser.sendMessage2ZaloTabs('@ZaDark:CHANGE_FONT', { font })
})

const handleBlockingRuleChange = (elName, ruleId) => {
  return () => {
    const isChecked = $(elName).is(':checked')

    const payload = isChecked
      ? { enableRulesetIds: [ruleId] }
      : { disableRulesetIds: [ruleId] }

    chrome.runtime.sendMessage({ action: MSG_ACTIONS.UPDATE_ENABLED_BLOCKING_RULE_IDS, payload })
  }
}

const initPrivacy = () => {
  const isSupportPrivacy = window.zadark.utils.getIsSupportPrivacy()

  const panelPrivacyElName = '#js-panel-privacy'
  const panelPrivacyNotAvailableElName = '#js-privacy-not-available'

  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  if (!isSupportPrivacy) {
    $(panelPrivacyNotAvailableElName).html(`Chưa hỗ trợ trên ${window.zadark.browser.name}`)
    $(panelPrivacyElName).addClass('not-available')
    return
  }

  chrome.runtime.sendMessage({ action: MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS }).then((ruleIds) => {
    if (!Array.isArray(ruleIds)) {
      return
    }

    $(switchBlockTypingElName).prop('checked', ruleIds.includes('rules_block_typing'))
    $(switchBlockSeenElName).prop('checked', ruleIds.includes('rules_block_seen'))
    $(switchBlockDeliveredElName).prop('checked', ruleIds.includes('rules_block_delivered'))
  })

  $(switchBlockTypingElName).on('change', handleBlockingRuleChange(switchBlockTypingElName, 'rules_block_typing'))
  $(switchBlockSeenElName).on('change', handleBlockingRuleChange(switchBlockSeenElName, 'rules_block_seen'))
  $(switchBlockDeliveredElName).on('change', handleBlockingRuleChange(switchBlockDeliveredElName, 'rules_block_delivered'))
}

initPrivacy()
