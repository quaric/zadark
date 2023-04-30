/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

const ratingElName = '#js-ext-rating'
const feedbackElName = '#js-ext-feedback'
const versionElName = '#js-ext-version'
const selectThemeElName = '#js-select-theme input:radio[name="theme"]'
const selectFontElName = '#js-select-font'
const manifestData = window.zadark.browser.getManifest()

const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
const switchBlockTypingElName = '#js-switch-block-typing'
const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockDeliveredElName = '#js-switch-block-delivered'

const MSG_ACTIONS = {
  CHANGE_THEME: '@ZaDark:CHANGE_THEME',
  CHANGE_FONT: '@ZaDark:CHANGE_FONT',
  CHANGE_HIDE_LATEST_MESSAGE: '@ZaDark:CHANGE_HIDE_LATEST_MESSAGE',
  GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
  UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS'
}

$(ratingElName).attr('href', window.zadark.utils.getRatingURL(window.zadark.browser.name))
$(feedbackElName).attr('href', window.zadark.utils.getFeedbackURL(window.zadark.browser.name))
$(versionElName).html(`Phiên bản ${manifestData.version}`)

// Init popup theme
window.zadark.utils.refreshPageTheme()

window.zadark.browser.getExtensionSettings().then(({ theme, font, enabledHideLatestMessage }) => {
  $(selectThemeElName).filter(`[value="${theme}"]`).attr('checked', true)
  $(selectFontElName).val(font)
  $(switchHideLatestMessageElName).prop('checked', enabledHideLatestMessage)
})

$(selectThemeElName).on('change', async function () {
  const theme = $(this).val()

  await window.zadark.browser.saveExtensionSettings({ theme })

  // Set popup theme
  window.zadark.utils.refreshPageTheme()

  // Set theme for all Zalo tabs
  window.zadark.browser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_THEME, { theme })
})

$(selectFontElName).on('change', async function () {
  const font = $(this).val()

  await window.zadark.browser.saveExtensionSettings({ font })

  // Set font for all Zalo tabs
  window.zadark.browser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_FONT, { font })
})

$(switchHideLatestMessageElName).on('change', async function () {
  const enabledHideLatestMessage = $(this).is(':checked')
  await window.zadark.browser.saveExtensionSettings({ enabledHideLatestMessage })

  // Set enabledHideLatestMessage for all Zalo tabs
  window.zadark.browser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_LATEST_MESSAGE, { enabledHideLatestMessage })
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

const enableBlocking = () => {
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

const disableBlocking = () => {
  const disabledList = [switchBlockTypingElName, switchBlockSeenElName, switchBlockDeliveredElName]

  disabledList.forEach((elName) => {
    $(elName).parent().parent().addClass('zadark-switch__disabled')
  })
}

const initBlocking = () => {
  const isSupportBlocking = window.zadark.utils.getIsSupportBlocking()

  if (isSupportBlocking) {
    enableBlocking()
  } else {
    disableBlocking()
  }
}

initBlocking()
