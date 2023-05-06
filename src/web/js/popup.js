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
const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'
const switchBlockTypingElName = '#js-switch-block-typing'
const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockDeliveredElName = '#js-switch-block-delivered'

const MSG_ACTIONS = {
  CHANGE_THEME: '@ZaDark:CHANGE_THEME',
  CHANGE_FONT: '@ZaDark:CHANGE_FONT',
  CHANGE_HIDE_LATEST_MESSAGE: '@ZaDark:CHANGE_HIDE_LATEST_MESSAGE',
  CHANGE_HIDE_THREAD_CHAT_MESSAGE: '@ZaDark:CHANGE_HIDE_THREAD_CHAT_MESSAGE',
  GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
  UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS'
}

$(ratingElName).attr('href', window.zadark.utils.getRatingURL(window.zadark.browser.name))
$(feedbackElName).attr('href', window.zadark.utils.getFeedbackURL(window.zadark.browser.name))
$(versionElName).html(`Phiên bản ${manifestData.version}`)

const iconQuestionSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z" fill="currentColor" /></svg>'
$('[data-tippy-content]').html(iconQuestionSVG)

tippy('[data-tippy-content]', {
  theme: 'zadark',
  allowHTML: true
})

// Init popup theme
window.zadark.utils.refreshPageTheme()

window.zadark.browser.getExtensionSettings().then(({ theme, font, enabledHideLatestMessage, enabledHideThreadChatMessage }) => {
  $(selectThemeElName).filter(`[value="${theme}"]`).attr('checked', true)
  $(selectFontElName).val(font)
  $(switchHideLatestMessageElName).prop('checked', enabledHideLatestMessage)
  $(switchHideThreadChatMessageElName).prop('checked', enabledHideThreadChatMessage)
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

$(switchHideThreadChatMessageElName).on('change', async function () {
  const enabledHideThreadChatMessage = $(this).is(':checked')
  await window.zadark.browser.saveExtensionSettings({ enabledHideThreadChatMessage })

  // Set enabledHideThreadChatMessage for all Zalo tabs
  window.zadark.browser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_THREAD_CHAT_MESSAGE, { enabledHideThreadChatMessage })
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
