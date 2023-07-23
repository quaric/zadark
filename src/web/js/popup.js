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

const manifestData = ZaDarkBrowser.getManifest()

const ratingElName = '#js-ext-rating'
const versionElName = '#js-ext-version'
const btnScrollElName = '#js-btn-scroll'

const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]'
const inputFontFamilyElName = '#js-input-font-family'
const selectFontSizeElName = '#js-select-font-size'

const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
const switchHideConvAvatarElName = '#js-switch-hide-conv-avatar'
const switchHideConvNameElName = '#js-switch-hide-conv-name'
const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

const switchBlockTypingElName = '#js-switch-block-typing'
const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockDeliveredElName = '#js-switch-block-delivered'

const switchUseHotkeysElName = '#js-switch-use-hotkeys'

$(ratingElName).attr('href', ZaDarkUtils.getRatingURL(ZaDarkBrowser.name))
$(versionElName).html(`Phiên bản ${manifestData.version}`)

ZaDarkBrowser.getExtensionSettings().then(({
  theme,
  fontFamily,
  fontSize,
  enabledHideLatestMessage,
  enabledHideConvAvatar,
  enabledHideConvName,
  enabledHideThreadChatMessage,
  useHotkeys
}) => {
  ZaDarkUtils.setPageTheme(theme)
  ZaDarkUtils.setUseHotkeysAttr(useHotkeys)

  $(radioInputThemeElName).filter(`[value="${theme}"]`).attr('checked', true)
  $(inputFontFamilyElName).val(fontFamily)
  $(selectFontSizeElName).val(fontSize)

  $(switchHideLatestMessageElName).prop('checked', enabledHideLatestMessage)
  $(switchHideConvAvatarElName).prop('checked', enabledHideConvAvatar)
  $(switchHideConvNameElName).prop('checked', enabledHideConvName)
  $(switchHideThreadChatMessageElName).prop('checked', enabledHideThreadChatMessage)

  $(switchUseHotkeysElName).prop('checked', useHotkeys)
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

$(switchHideConvAvatarElName).on('change', async function () {
  const enabledHideConvAvatar = $(this).is(':checked')
  await ZaDarkUtils.updateHideConvAvatar(enabledHideConvAvatar)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_CONV_AVATAR, { enabledHideConvAvatar })
})

$(switchHideConvNameElName).on('change', async function () {
  const enabledHideConvName = $(this).is(':checked')
  await ZaDarkUtils.updateHideConvName(enabledHideConvName)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_CONV_NAME, { enabledHideConvName })
})

$(switchHideThreadChatMessageElName).on('change', async function () {
  const enabledHideThreadChatMessage = $(this).is(':checked')
  await ZaDarkUtils.updateHideThreadChatMessage(enabledHideThreadChatMessage)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_HIDE_THREAD_CHAT_MESSAGE, { enabledHideThreadChatMessage })
})

$(switchUseHotkeysElName).on('change', async function () {
  const useHotkeys = $(this).is(':checked')
  await ZaDarkUtils.updateUseHotkeys(useHotkeys)
  ZaDarkBrowser.sendMessage2ZaloTabs(MSG_ACTIONS.CHANGE_USE_HOTKEYS, { useHotkeys })
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

const loadBlocking = () => {
  const isEnabled = ZaDarkUtils.isSupportDeclarativeNetRequest()

  if (!isEnabled) {
    const disabledList = [switchBlockTypingElName, switchBlockSeenElName, switchBlockDeliveredElName]

    disabledList.forEach((elName) => {
      $(elName).parent().parent().addClass('zadark-switch--disabled')
    })

    return
  }

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

loadBlocking()

$(btnScrollElName).on('click', () => {
  const elName = 'html, body'
  $(elName).animate({ scrollTop: $(elName).height() }, 1000)
})

const calcPopupScroll = () => {
  const scrolledFromTop = $(window).scrollTop()
  const scrollable = $(window).height() < $(document).height()

  if (!scrollable || scrolledFromTop >= 24) {
    $(btnScrollElName).fadeOut(150)
  } else {
    $(btnScrollElName).fadeIn(150)
  }
}

calcPopupScroll()

$(window).on('scroll', ZaDarkUtils.debounce(calcPopupScroll, 150))
