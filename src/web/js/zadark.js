/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

(function () {
  ZaDarkBrowser.initClassNames()
  ZaDarkUtils.initOSName()
  ZaDarkUtils.refreshPageSettings()

  const MSG_ACTIONS = {
    CHANGE_THEME: '@ZaDark:CHANGE_THEME',
    CHANGE_FONT: '@ZaDark:CHANGE_FONT',
    CHANGE_FONT_SIZE: '@ZaDark:CHANGE_FONT_SIZE',

    CHANGE_HIDE_LATEST_MESSAGE: '@ZaDark:CHANGE_HIDE_LATEST_MESSAGE',
    CHANGE_HIDE_CONV_AVATAR_NAME: '@ZaDark:CHANGE_HIDE_CONV_AVATAR_NAME',
    CHANGE_HIDE_THREAD_CHAT_MESSAGE: '@ZaDark:CHANGE_HIDE_THREAD_CHAT_MESSAGE',

    GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
    UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS'
  }

  const HOTKEYS_TOAST_MESSAGE = {
    fontSize: {
      small: 'Cỡ chữ : Nhỏ',
      medium: 'Cỡ chữ : Trung bình',
      big: 'Cỡ chữ : Lớn',
      'very-big': 'Cỡ chữ : Rất lớn'
    },
    hideLatestMessage: {
      true: 'BẬT : Ẩn Tin nhắn gần nhất',
      false: 'TẮT : Ẩn Tin nhắn gần nhất'
    },
    hideThreadChatMessage: {
      true: 'BẬT : Ẩn Tin nhắn trong cuộc trò chuyện',
      false: 'TẮT : Ẩn Tin nhắn trong cuộc trò chuyện'
    },
    HideConvAvatarName: {
      true: 'BẬT : Ẩn Ảnh đại diện & Tên cuộc trò chuyện',
      false: 'TẮT : Ẩn Ảnh đại diện & Tên cuộc trò chuyện'
    },
    rules_block_typing: {
      true: 'BẬT : Ẩn trạng thái Đang soạn tin (Typing) ...',
      false: 'TẮT : Ẩn trạng thái Đang soạn tin (Typing) ...'
    },
    rules_block_delivered: {
      true: 'BẬT : Ẩn trạng thái Đã nhận (Received)',
      false: 'TẮT : Ẩn trạng thái Đã nhận (Received)'
    },
    rules_block_seen: {
      true: 'BẬT : Ẩn trạng thái Đã xem (Seen)',
      false: 'TẮT : Ẩn trạng thái Đã xem (Seen)'
    }
  }

  const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]'
  const selectFontElName = '#js-select-font'
  const selectFontSizeElName = '#js-select-font-size'

  const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
  const switchHideConvAvatarNameElName = '#js-switch-hide-conv-avatar-name'
  const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  const setSelectTheme = (theme) => {
    const options = ['light', 'dark', 'auto']
    options.forEach((option) => {
      $(radioInputThemeElName).filter(`[value="${option}"]`).prop('checked', option === theme)
    })
  }

  const setSelect = (elName, value) => {
    $(elName).val(value)
  }

  const setSwitch = (elName, enabled) => {
    $(elName).prop('checked', enabled)
  }

  async function handleSelectThemeChange () {
    const theme = $(this).val()
    await ZaDarkBrowser.saveExtensionSettings({ theme })
    ZaDarkUtils.refreshPageSettings()
    setSelectTheme(theme)
  }

  async function handleSelectFontChange () {
    const font = $(this).val()
    await ZaDarkBrowser.saveExtensionSettings({ font })
    ZaDarkUtils.refreshPageSettings()
  }

  async function handleSelectFontSizeChange () {
    const fontSize = $(this).val()
    await ZaDarkBrowser.saveExtensionSettings({ fontSize })
    ZaDarkUtils.refreshPageSettings()
  }

  async function handleHideLastestMessageChange () {
    const enabledHideLatestMessage = $(this).is(':checked')
    await ZaDarkBrowser.saveExtensionSettings({ enabledHideLatestMessage })
    ZaDarkUtils.refreshPageSettings()
    ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE.hideLatestMessage[enabledHideLatestMessage])
  }

  async function handleHideConvAvatarNameChange () {
    const enabledHideConvAvatarName = $(this).is(':checked')
    await ZaDarkBrowser.saveExtensionSettings({ enabledHideConvAvatarName })
    ZaDarkUtils.refreshPageSettings()
    ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE.HideConvAvatarName[enabledHideConvAvatarName])
  }

  async function handleHideThreadChatMessageChange () {
    const enabledHideThreadChatMessage = $(this).is(':checked')
    await ZaDarkBrowser.saveExtensionSettings({ enabledHideThreadChatMessage })
    ZaDarkUtils.refreshPageSettings()
    ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE.hideThreadChatMessage[enabledHideThreadChatMessage])
  }

  const handleBlockingRuleChange = (elName, ruleId) => {
    return () => {
      const isEnabled = $(elName).is(':checked')

      const payload = isEnabled
        ? { enableRulesetIds: [ruleId] }
        : { disableRulesetIds: [ruleId] }

      ZaDarkBrowser.sendMessage({ action: MSG_ACTIONS.UPDATE_ENABLED_BLOCKING_RULE_IDS, payload })
      ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE[ruleId][isEnabled])
    }
  }

  const zadarkButtonHTML = `
    <div id="div_Main_TabZaDark" class="clickable leftbar-tab flx flx-col flx-al-c flx-center rel" data-id="div_Main_TabZaDark">
      <i class="zadark-icon zadark-icon--zadark"></i>
      <div class="lb-tab-title truncate">ZaDark</div>
    </div>
  `

  const popupHeaderHTML = `
    <div class="zadark-popup__header">
      <div class="zadark-popup__header__logo">
        <a href="https://zadark.quaric.com" title="ZaDark – Zalo Dark Mode" target="_blank" class="zadark-popup__header__logo-link">
          <img src="${ZaDarkBrowser.getURL('images/zadark-lockup.svg')}" alt="ZaDark" class="zadark-popup__header__logo-img" />
        </a>
      </div>

      <div class="zadark-popup__header__menu-list">
        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="${ZaDarkUtils.getRatingURL(ZaDarkBrowser.name)}" title="Bình chọn" target="_blank">Bình chọn</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.canny.io" title="Phản hồi" target="_blank">Phản hồi</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.quaric.com/blog/changelog" title="Có gì mới trong phiên bản này?" target="_blank">Phiên bản ${ZaDarkBrowser.getManifest().version}</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-coffee">
          <a href="https://zadark.quaric.com/donate" title="Donate" target="_blank">
            <img src="${ZaDarkBrowser.getURL('images/zadark-coffee.png')}" alt="Donate" />
          </a>
        </span>
      </div>
    </div>
  `

  const popupMainHTML = `
    <div class="zadark-popup__main">
      <label class="zadark-form__label">Giao diện</label>

      <div class="zadark-panel">
        <div class="zadark-panel__body">
          <div id="js-radio-input-theme" class="zadark-radio__list">
            <label class="zadark-radio">
              <input type="radio" name="theme" value="light" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Sáng</span>
              </span>
            </label>

            <label class="zadark-radio">
              <input type="radio" name="theme" value="dark" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Tối</span>
              </span>
            </label>

            <label class="zadark-radio">
              <input type="radio" name="theme" value="auto" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Theo hệ thống</span>
              </span>
            </label>
          </div>

          <div class="select-font select-font--border-default">
            <label class="select-font__label">Thay đổi phông chữ</label>

            <select id="js-select-font" class="zadark-select zadark-select--text-right">
              <option value="default">Mặc định</option>
              <option value="open-sans">Open Sans</option>
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="lato">Lato</option>
              <option value="source-sans-pro">Source Sans Pro</option>
            </select>
          </div>

          <div class="select-font select-font--hotkeys">
            <label class="select-font__label">Thay đổi cỡ chữ của tin nhắn</label>

            <span class="select-font__hotkeys">
              <span class="zadark-hotkeys" data-keys-win="Alt+= / Alt+−" data-keys-mac="⌥= / ⌥−"></span>
            </span>

            <select id="js-select-font-size" class="zadark-select zadark-select--text-right">
              <option value="small">Nhỏ</option>
              <option value="medium">Trung bình</option>
              <option value="big">Lớn</option>
              <option value="very-big">Rất lớn</option>
            </select>
          </div>
        </div>
      </div>

      <div id="js-panel-privacy">
        <label class="zadark-form__label" id="privacy">Riêng tư</label>

        <div class="zadark-panel">
          <div class="zadark-panel__body">
            <div class="zadark-switch__list">
              <div class="zadark-switch">
                <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-latest-message">
                  Ẩn <strong>Tin nhắn gần nhất</strong>
                  <i class="zadark-icon zadark-icon--question" data-tippy-content='<p>Để xem nội dung tin nhắn, bạn di chuột vào "<strong>Tên cuộc trò chuyện</strong>" cần xem.</p>'></i>
                </label>
                <span class="zadark-switch__hotkeys">
                  <span class="zadark-hotkeys" data-keys-win="Ctrl+1" data-keys-mac="⌘1"></span>
                </span>
                <label class="zadark-switch__checkbox">
                  <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-latest-message">
                  <span class="zadark-switch__slider"></span>
                </label>
              </div>

              <div class="zadark-switch">
                <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-thread-chat-message">
                  Ẩn <strong>Tin nhắn</strong> trong cuộc trò chuyện
                  <i class="zadark-icon zadark-icon--question" data-tippy-content='<p>Để xem nội dung tin nhắn, bạn di chuột vào "<strong>Vùng hiển thị tin nhắn</strong>". Khi bạn di chuột ra khỏi vùng này, tin nhắn sẽ được ẩn đi.</p>'></i>
                </label>
                <span class="zadark-switch__hotkeys">
                  <span class="zadark-hotkeys" data-keys-win="Ctrl+2" data-keys-mac="⌘2"></span>
                </span>
                <label class="zadark-switch__checkbox">
                  <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-thread-chat-message">
                  <span class="zadark-switch__slider"></span>
                </label>
              </div>

              <div class="zadark-switch zadark-switch--border-default">
                <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-conv-avatar-name">
                  Ẩn <strong>Ảnh đại diện & Tên</strong> cuộc trò chuyện
                  <i class="zadark-icon zadark-icon--question" data-tippy-content='<p>Để xem Ảnh đại diện & Tên cuộc trò chuyện, bạn di chuyển chuột vào "<strong>Tên cuộc trò chuyện</strong>" cần xem.</p>'></i>
                </label>
                <span class="zadark-switch__hotkeys">
                  <span class="zadark-hotkeys" data-keys-win="Ctrl+3" data-keys-mac="⌘3"></span>
                </span>
                <label class="zadark-switch__checkbox">
                  <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-conv-avatar-name">
                  <span class="zadark-switch__slider"></span>
                </label>
              </div>

              <div class="zadark-switch">
                <label class="zadark-switch__label" for="js-switch-block-typing">Ẩn trạng thái <strong>Đang soạn tin (Typing) ...</strong></label>
                <span class="zadark-switch__hotkeys">
                  <span class="zadark-hotkeys" data-keys-win="Ctrl+4" data-keys-mac="⌘4"></span>
                </span>
                <label class="zadark-switch__checkbox">
                  <input class="zadark-switch__input" type="checkbox" id="js-switch-block-typing">
                  <span class="zadark-switch__slider"></span>
                </label>
              </div>

              <div class="zadark-switch">
                <label class="zadark-switch__label" for="js-switch-block-delivered">Ẩn trạng thái <strong>Đã nhận (Received)</strong></label>
                <span class="zadark-switch__hotkeys">
                  <span class="zadark-hotkeys" data-keys-win="Ctrl+5" data-keys-mac="⌘5"></span>
                </span>
                <label class="zadark-switch__checkbox">
                  <input class="zadark-switch__input" type="checkbox" id="js-switch-block-delivered">
                  <span class="zadark-switch__slider"></span>
                </label>
              </div>

              <div class="zadark-switch">
                <label class="zadark-switch__label" for="js-switch-block-seen">Ẩn trạng thái <strong>Đã xem (Seen)</strong></label>
                <span class="zadark-switch__hotkeys">
                  <span class="zadark-hotkeys" data-keys-win="Ctrl+6" data-keys-mac="⌘6"></span>
                </span>
                <label class="zadark-switch__checkbox">
                  <input class="zadark-switch__input" type="checkbox" id="js-switch-block-seen">
                  <span class="zadark-switch__slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const popupFooterHTML = `
    <div class="zadark-popup__footer">
      <div class="zadark-publisher">
        <span class="zadark-publisher__from">ZaDark from</span>
        <img src="${ZaDarkBrowser.getURL('images/quaric-lockup-dark.svg')}" class="zadark-publisher__lockup zadark-publisher__lockup--dark">
        <img src="${ZaDarkBrowser.getURL('images/quaric-lockup-light.svg')}" class="zadark-publisher__lockup zadark-publisher__lockup--light">
      </div>
    </div>
  `

  const zadarkPopupHTML = `
    <div id="zadark-popup" class="zadark-popper">
      ${popupHeaderHTML}
      ${popupMainHTML}
      ${popupFooterHTML}
    </div>
  `

  const enableBlocking = async () => {
    const ruleIds = await ZaDarkBrowser.sendMessage({ action: MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS })

    if (!Array.isArray(ruleIds)) {
      return
    }

    $(switchBlockTypingElName).prop('checked', ruleIds.includes('rules_block_typing'))
    $(switchBlockSeenElName).prop('checked', ruleIds.includes('rules_block_seen'))
    $(switchBlockDeliveredElName).prop('checked', ruleIds.includes('rules_block_delivered'))
  }

  const disableBlocking = () => {
    const disabledList = [switchBlockTypingElName, switchBlockSeenElName, switchBlockDeliveredElName]

    disabledList.forEach((elName) => {
      $(elName).parent().parent().addClass('zadark-switch--disabled')
    })
  }

  const loadPopupState = async () => {
    const {
      theme,
      font,
      fontSize,
      enabledHideLatestMessage,
      enabledHideConvAvatarName,
      enabledHideThreadChatMessage
    } = await ZaDarkBrowser.getExtensionSettings()

    setSelectTheme(theme)
    setSelect(selectFontElName, font)
    setSelect(selectFontSizeElName, fontSize)

    setSwitch(switchHideLatestMessageElName, enabledHideLatestMessage)
    setSwitch(switchHideConvAvatarNameElName, enabledHideConvAvatarName)
    setSwitch(switchHideThreadChatMessageElName, enabledHideThreadChatMessage)

    if (ZaDarkUtils.isSupportDeclarativeNetRequest()) {
      enableBlocking()
    } else {
      disableBlocking()
    }
  }

  const loadKnownVersionState = async (buttonEl) => {
    const { knownVersion } = await ZaDarkBrowser.getExtensionSettings()
    const zadarkVersion = ZaDarkBrowser.getManifest().version

    if (knownVersion !== zadarkVersion) {
      buttonEl.classList.add('zadark-known-version')
    }
  }

  const updateKnownVersionState = (buttonEl) => {
    const zadarkVersion = ZaDarkBrowser.getManifest().version
    ZaDarkBrowser.saveExtensionSettings({ knownVersion: zadarkVersion })

    buttonEl.classList.remove('zadark-known-version')
  }

  const openZaDarkPopup = (popupInstance, buttonEl, popupEl) => {
    return () => {
      loadPopupState()
      updateKnownVersionState(buttonEl)

      buttonEl.classList.add('selected')
      popupEl.setAttribute('data-visible', '')

      popupInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: true }
        ]
      }))

      popupInstance.update()
    }
  }

  const hideZaDarkPopup = (popupInstance, buttonEl, popupEl) => {
    return (event) => {
      const isOpen = popupEl.getAttribute('data-visible') !== null
      const isClickOutside = isOpen && !popupEl.contains(event.target) && !buttonEl.contains(event.target)

      if (!isClickOutside) {
        return
      }

      buttonEl.classList.remove('selected')
      popupEl.removeAttribute('data-visible')

      popupInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false }
        ]
      }))
    }
  }

  const handleNextFontSize = async (count) => {
    const {
      fontSize
    } = await ZaDarkBrowser.getExtensionSettings()

    const fontSizes = ['small', 'medium', 'big', 'very-big']

    const nextIndex = count > 0
      ? Math.min(fontSizes.indexOf(fontSize) + 1, fontSizes.length - 1)
      : Math.max(fontSizes.indexOf(fontSize) - 1, 0)

    const nextFontSize = fontSizes[nextIndex]

    setSelect(selectFontSizeElName, nextFontSize)
    handleSelectFontSizeChange.bind($(selectFontSizeElName))()
    ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE.fontSize[nextFontSize])
  }

  const loadHotkeys = () => {
    hotkeys.filter = function (event) {
      const target = event.target || event.srcElement
      const tagName = target.tagName
      let flag = true // ignore: <input> and <textarea> when readOnly state is false, <select>

      if ((tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
        flag = false
      }

      return flag
    }

    const keys = [
    // Mac
      'command+1',
      'command+2',
      'command+3',
      'command+4',
      'command+5',
      'command+6',

      // Windows
      'ctrl+1',
      'ctrl+2',
      'ctrl+3',
      'ctrl+4',
      'ctrl+5',
      'ctrl+6',

      // Both
      'option+z',
      'option+=',
      'option+-'
    ].join(',')

    hotkeys(keys, async function (event, handler) {
      event.preventDefault()

      const {
        enabledHideLatestMessage,
        enabledHideThreadChatMessage,
        enabledHideConvAvatarName,

        enabledBlockTyping,
        enabledBlockSeen,
        enabledBlockDelivered
      } = await ZaDarkBrowser.getExtensionSettings()

      switch (handler.key) {
      // Hide latest message
        case 'command+1':
        case 'ctrl+1': {
          setSwitch(switchHideLatestMessageElName, !enabledHideLatestMessage)
          handleHideLastestMessageChange.bind($(switchHideLatestMessageElName))()
          return
        }

        // Hide thread chat message
        case 'command+2':
        case 'ctrl+2': {
          setSwitch(switchHideThreadChatMessageElName, !enabledHideThreadChatMessage)
          handleHideThreadChatMessageChange.bind($(switchHideThreadChatMessageElName))()
          return
        }

        // Hide conversation avatar & name
        case 'command+3':
        case 'ctrl+3': {
          setSwitch(switchHideConvAvatarNameElName, !enabledHideConvAvatarName)
          handleHideConvAvatarNameChange.bind($(switchHideConvAvatarNameElName))()
          return
        }

        // Block typing
        case 'command+4':
        case 'ctrl+4': {
          setSwitch(switchBlockTypingElName, !enabledBlockTyping)
          handleBlockingRuleChange(switchBlockTypingElName, 'rules_block_typing').bind($(switchBlockTypingElName))()
          return
        }

        // Block delivered
        case 'command+5':
        case 'ctrl+5': {
          setSwitch(switchBlockDeliveredElName, !enabledBlockDelivered)
          handleBlockingRuleChange(switchBlockDeliveredElName, 'rules_block_delivered').bind($(switchBlockDeliveredElName))()
          return
        }

        // Block seen
        case 'command+6':
        case 'ctrl+6': {
          setSwitch(switchBlockSeenElName, !enabledBlockSeen)
          handleBlockingRuleChange(switchBlockSeenElName, 'rules_block_seen').bind($(switchBlockSeenElName))()
          return
        }

        // Increase font size
        case 'option+=': {
          handleNextFontSize(1)
          return
        }

        // Decrease font size
        case 'option+-': {
          handleNextFontSize(-1)
          return
        }

        // Open ZaDark Settings
        case 'option+z': {
          const buttonEl = document.getElementById('div_Main_TabZaDark')
          buttonEl.click()
        }
      }
    })
  }

  const loadZaDarkPopup = () => {
    const [zaloTabsBottomEl] = document.querySelectorAll('.nav__tabs__bottom')

    if (!zaloTabsBottomEl) {
      return
    }

    zaloTabsBottomEl.insertAdjacentHTML('afterbegin', zadarkButtonHTML)

    const zaloAppBody = document.body
    zaloAppBody.insertAdjacentHTML('beforeend', zadarkPopupHTML)

    $(radioInputThemeElName).on('change', handleSelectThemeChange)
    $(selectFontElName).on('change', handleSelectFontChange)
    $(selectFontSizeElName).on('change', handleSelectFontSizeChange)

    $(switchHideLatestMessageElName).on('change', handleHideLastestMessageChange)
    $(switchHideConvAvatarNameElName).on('change', handleHideConvAvatarNameChange)
    $(switchHideThreadChatMessageElName).on('change', handleHideThreadChatMessageChange)

    $(switchBlockTypingElName).on('change', handleBlockingRuleChange(switchBlockTypingElName, 'rules_block_typing'))
    $(switchBlockSeenElName).on('change', handleBlockingRuleChange(switchBlockSeenElName, 'rules_block_seen'))
    $(switchBlockDeliveredElName).on('change', handleBlockingRuleChange(switchBlockDeliveredElName, 'rules_block_delivered'))

    const popupEl = document.querySelector('#zadark-popup')
    const buttonEl = document.getElementById('div_Main_TabZaDark')

    const popupInstance = Popper.createPopper(buttonEl, popupEl, {
      placement: 'right-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [112, 0]
          }
        }
      ]
    })

    const hideEvents = ['click', 'contextmenu']
    buttonEl.addEventListener('click', openZaDarkPopup(popupInstance, buttonEl, popupEl))
    hideEvents.forEach((eventName) => {
      window.addEventListener(
        eventName,
        hideZaDarkPopup(popupInstance, buttonEl, popupEl),
        true
      )
    })

    loadPopupState()
    loadKnownVersionState(buttonEl)
    loadHotkeys()

    tippy('[data-tippy-content]', {
      theme: 'zadark',
      allowHTML: true
    })

    tippy('#div_Main_TabZaDark', {
      theme: 'zadark',
      allowHTML: true,
      content: '<span>ZaDark <span class="zadark-hotkeys" data-keys-win="Alt+Z" data-keys-mac="⌥Z"></span></span>',
      placement: 'right'
    })
  }

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.id === 'app-page') {
          loadZaDarkPopup()
          observer.disconnect()
        }
      })
    })
  })

  observer.observe(document.querySelector('#app'), { subtree: false, childList: true })

  ZaDarkBrowser.addMessageListener((message, sender, sendResponse) => {
    if (message.action === MSG_ACTIONS.CHANGE_THEME) {
      ZaDarkUtils.refreshPageSettings()
      setSelectTheme(message.payload.theme)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_FONT) {
      ZaDarkUtils.refreshPageSettings()
      setSelect(selectFontElName, message.payload.font)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_FONT_SIZE) {
      ZaDarkUtils.refreshPageSettings()
      setSelect(selectFontSizeElName, message.payload.fontSize)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_LATEST_MESSAGE) {
      ZaDarkUtils.refreshPageSettings()
      setSwitch(switchHideLatestMessageElName, message.payload.enabledHideLatestMessage)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_CONV_AVATAR_NAME) {
      ZaDarkUtils.refreshPageSettings()
      setSwitch(switchHideConvAvatarNameElName, message.payload.enabledHideConvAvatarName)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_THREAD_CHAT_MESSAGE) {
      ZaDarkUtils.refreshPageSettings()
      setSwitch(switchHideThreadChatMessageElName, message.payload.enabledHideThreadChatMessage)
      sendResponse({ received: true })
    }
  })
})()
