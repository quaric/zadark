/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

const versionElName = '#js-ext-version'
const selectThemeElName = '#js-select-theme input:radio[name="theme"]'
const manifestData = window.zadark.browser.getManifest()

$(versionElName).html(`Phiên bản ${manifestData.version}`)
$(versionElName).on('click', () => {
  window.zadark.browser.createTab({ url: 'changelog.html' })
})

window.zadark.utils.refreshPageTheme()
window.zadark.browser.getExtensionSettings().then(({ theme }) => {
  $(selectThemeElName).filter(`[value="${theme}"]`).attr('checked', true)
})

const setPageThemeForAllZaloTabs = async () => {
  // Get all Zalo tabs
  const tabs = await window.zadark.browser.getZaloTabs()

  const hasResult = Array.isArray(tabs) && tabs.length > 0
  if (!hasResult) {
    return
  }

  // Set page theme for all Zalo tabs
  tabs.forEach((tab) => {
    window.zadark.browser.executeScript(tab.id, 'js/execute-script.js')
  })
}

const fireThemeSettingsChanged = () => {
  // Set page theme for all Zalo tabs
  setPageThemeForAllZaloTabs()

  // Set popup theme
  window.zadark.utils.refreshPageTheme()
}

$(selectThemeElName).on('change', async function () {
  const theme = $(this).val()
  await window.zadark.browser.saveExtensionSettings({ theme })
  fireThemeSettingsChanged()
})

// Privacy

const getIsSupportPrivacy = () => {
  const { parsedResult: { browser } } = bowser.getParser(window.navigator.userAgent)

  const browserName = browser.name
  const browserVersion = parseFloat(browser.version)

  // Chrome (Chromium) 84+ supports Declarative Net Request WebExtensions API
  if (['Chrome', 'Microsoft Edge', 'Opera'].includes(browserName) && browserVersion >= 84) {
    return true
  }

  // Safari 15+ supports Declarative Net Request WebExtensions API
  if (browserName === 'Safari' && browserVersion >= 15) {
    return true
  }

  return false
}

const isSupportPrivacy = getIsSupportPrivacy()

if (isSupportPrivacy) {
  const panelPrivacyElName = '#js-panel-privacy'
  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  $(panelPrivacyElName).show()

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
}
