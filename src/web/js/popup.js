/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

ZaDarkUtils.initOSName()
ZaDarkUtils.initTippy()

const MSG_ACTIONS = ZaDarkUtils.MSG_ACTIONS

window.WebFontConfig = {
  google: {
    families: ['Open Sans:400,600']
  }
};

(function (d) {
  const wf = d.createElement('script'); const s = d.scripts[0]
  wf.src = 'libs/webfont.min.js'
  wf.async = true
  s.parentNode.insertBefore(wf, s)
})(document)

const ratingElName = '#js-ext-rating'
const versionElName = '#js-ext-version'
const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]'
const inputFontFamilyElName = '#js-input-font-family'
const selectFontSizeElName = '#js-select-font-size'
const manifestData = ZaDarkBrowser.getManifest()

const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
const switchHideConvAvatarNameElName = '#js-switch-hide-conv-avatar-name'
const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

const switchBlockTypingElName = '#js-switch-block-typing'
const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockDeliveredElName = '#js-switch-block-delivered'

$(ratingElName).attr('href', ZaDarkUtils.getRatingURL(ZaDarkBrowser.name))
$(versionElName).html(`Phiên bản ${manifestData.version}`)

ZaDarkBrowser.getExtensionSettings().then(({ theme, fontFamily, fontSize, enabledHideLatestMessage, enabledHideConvAvatarName, enabledHideThreadChatMessage }) => {
  ZaDarkUtils.setPageTheme(theme)

  $(radioInputThemeElName).filter(`[value="${theme}"]`).attr('checked', true)
  $(inputFontFamilyElName).val(fontFamily)
  $(selectFontSizeElName).val(fontSize)

  $(switchHideLatestMessageElName).prop('checked', enabledHideLatestMessage)
  $(switchHideConvAvatarNameElName).prop('checked', enabledHideConvAvatarName)
  $(switchHideThreadChatMessageElName).prop('checked', enabledHideThreadChatMessage)
})

$(radioInputThemeElName).on('change', async function () {
  const theme = $(this).val()
  await ZaDarkUtils.updateTheme(theme)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_THEME, { theme })
})

$(inputFontFamilyElName).keypress(async function (event) {
  const isEnter = Number(event.keyCode ? event.keyCode : event.which) - 1 === 12

  if (!isEnter) {
    return
  }

  const fontFamily = $(this).val()
  const success = await ZaDarkUtils.updateFontFamily(fontFamily)

  if (success) {
    ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.REFRESH_ZALO_TABS)
  } else {
    $(this).val('')
  }
})

$(selectFontSizeElName).on('change', async function () {
  const fontSize = $(this).val()
  await ZaDarkUtils.updateFontSize(fontSize)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_FONT_SIZE, { fontSize })
})

$(switchHideLatestMessageElName).on('change', async function () {
  const enabledHideLatestMessage = $(this).is(':checked')
  await ZaDarkUtils.updateHideLatestMessage(enabledHideLatestMessage)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_LATEST_MESSAGE, { enabledHideLatestMessage })
})

$(switchHideConvAvatarNameElName).on('change', async function () {
  const enabledHideConvAvatarName = $(this).is(':checked')
  await ZaDarkUtils.updateHideConvAvatarName(enabledHideConvAvatarName)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_CONV_AVATAR_NAME, { enabledHideConvAvatarName })
})

$(switchHideThreadChatMessageElName).on('change', async function () {
  const enabledHideThreadChatMessage = $(this).is(':checked')
  await ZaDarkUtils.updateHideThreadChatMessage(enabledHideThreadChatMessage)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_THREAD_CHAT_MESSAGE, { enabledHideThreadChatMessage })
})

const handleBlockingRuleChange = (elName, ruleId) => {
  return () => {
    const isChecked = $(elName).is(':checked')

    const payload = isChecked
      ? { enableRulesetIds: [ruleId] }
      : { disableRulesetIds: [ruleId] }

    ZaDarkBrowser.sendMessage({ action: MSG_ACTIONS.UPDATE_ENABLED_BLOCKING_RULE_IDS, payload })
  }
}

const enableBlocking = () => {
  ZaDarkBrowser.sendMessage({ action: MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS }).then((ruleIds) => {
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
    $(elName).parent().parent().addClass('zadark-switch--disabled')
  })
}

if (ZaDarkUtils.isSupportDeclarativeNetRequest()) {
  enableBlocking()
} else {
  disableBlocking()
}
