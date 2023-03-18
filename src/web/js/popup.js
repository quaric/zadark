/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

const versionElName = '#js-ext-version'
const selectThemeElName = '#js-select-theme input:radio[name="theme"]'
const selectFontElName = '#js-select-font'
const manifestData = window.zadark.browser.getManifest()

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

// Privacy

const panelPrivacyElName = '#js-panel-privacy'

const isSupportPrivacy = window.zadark.utils.getIsSupportPrivacy()

if (isSupportPrivacy) {
  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  window.zadark.browser.getEnabledBlockingRuleIds().then((ruleIds) => {
    $(switchBlockTypingElName).prop('checked', ruleIds.includes('rules_block_typing'))
    $(switchBlockSeenElName).prop('checked', ruleIds.includes('rules_block_seen'))
    $(switchBlockDeliveredElName).prop('checked', ruleIds.includes('rules_block_delivered'))
  })

  const handleBlockingRuleChange = function (elName, ruleId) {
    return function () {
      const isChecked = $(elName).is(':checked')
      window.zadark.browser.updateEnabledBlockingRuleIds(isChecked
        ? { enableRuleIds: [ruleId] }
        : { disableRuleIds: [ruleId] }
      )
    }
  }

  $(switchBlockTypingElName).on('change', handleBlockingRuleChange(switchBlockTypingElName, 'rules_block_typing'))
  $(switchBlockSeenElName).on('change', handleBlockingRuleChange(switchBlockSeenElName, 'rules_block_seen'))
  $(switchBlockDeliveredElName).on('change', handleBlockingRuleChange(switchBlockDeliveredElName, 'rules_block_delivered'))
} else {
  $(panelPrivacyElName).hide()
}
