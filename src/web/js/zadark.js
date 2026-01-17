/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

(function () {
  // const log = console.log.bind(console, '[zadark-reaction]')

  ZaDarkBrowser.initClassNames()
  ZaDarkUtils.initPageSettings()

  document.documentElement.setAttribute('data-zadark-emoji-url', ZaDarkBrowser.getURL('/images/zalo-emoji-md.png'))

  const popupScrollableElName = '#js-zadark-popup__scrollable'
  const btnScrollElName = '#js-btn-scroll'

  const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]'
  const inputFontFamilyElName = '#js-input-font-family'
  const selectFontSizeElName = '#js-select-font-size'
  const selectTranslateTargetElName = '#js-select-translate-target'
  const inputThreadChatBgElName = '#js-input-thread-chat-bg'
  const buttonDelThreadChatBgElName = '#js-button-del-thread-chat-bg'

  const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
  const switchHideConvAvatarElName = '#js-switch-hide-conv-avatar'
  const switchHideConvNameElName = '#js-switch-hide-conv-name'
  const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  const switchUseHotkeysElName = '#js-switch-use-hotkeys'

  const setRadioInputTheme = (theme) => {
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

  const handleNextTheme = async () => {
    const {
      theme
    } = await ZaDarkBrowser.getExtensionSettings()

    const themes = ['light', 'dark']

    const nextIndex = themes.indexOf(theme) + 1
    const nextTheme = themes[nextIndex] || themes[0]
    updateTheme(nextTheme)
  }

  async function handleInputFontFamilyKeyPress (event) {
    const isEnter = Number(event.keyCode ? event.keyCode : event.which) - 1 === 12

    if (!isEnter) {
      return
    }

    const fontFamily = $(this).val()
    const success = await ZaDarkUtils.updateFontFamily(fontFamily)

    if (!success) {
      $(this).val('')
    }
  }

  const handleNextFontSize = async (count) => {
    const {
      fontSize
    } = await ZaDarkBrowser.getExtensionSettings()

    // Parse fontSize to number, fallback to 16 if invalid
    const currentSize = parseInt(fontSize) || 16

    // Define valid font sizes (12-24)
    const minSize = 12
    const maxSize = 24

    // Calculate next size
    const nextSize = count > 0
      ? Math.min(currentSize + 1, maxSize)
      : Math.max(currentSize - 1, minSize)

    updateFontSize(String(nextSize))
  }

  const handleBlockingRuleChange = (ruleId) => {
    return function () {
      const isEnabled = $(this).is(':checked')

      const payload = isEnabled
        ? { enableRulesetIds: [ruleId] }
        : { disableRulesetIds: [ruleId] }

      ZaDarkBrowser.sendMessage({ action: MSG_ACTIONS.UPDATE_ENABLED_BLOCKING_RULE_IDS, payload })
      ZaDarkUtils.showToast(ZaDarkUtils.HOTKEYS_TOAST_MESSAGE[ruleId][isEnabled])
    }
  }

  function handleUseHotkeysChange () {
    const isEnabled = $(this).is(':checked')
    useHotkeys(isEnabled)
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
        <img src="${ZaDarkBrowser.getURL('images/zadark-lockup.svg')}" alt="ZaDark" class="zadark-popup__header__logo-img" />
      </div>

      <div class="zadark-popup__header__menu-list">
        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.com?utm_source=zadark-web" title="Website" target="_blank">Website</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="${ZaDarkUtils.getRatingURL(ZaDarkBrowser.name)}" title="Đánh giá" target="_blank">Đánh giá</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.canny.io?utm_source=zadark-web" title="Góp ý" target="_blank">Góp ý</a>
        </span>

        <span class="zadark-popup__header__menu-item">
          <a href="https://zadark.com/sponsors?utm_source=zadark-web" title="Nhà tài trợ" target="_blank">Nhà tài trợ</a>
        </span>
      </div>
    </div>
  `

  const popupMainHTML = `
    <div class="zadark-popup__main">
      <div class="zadark-panel">
        <div class="zadark-panel__body">
          <div id="js-radio-input-theme" class="zadark-radio__list zadark-radio__list--row">
            <label class="zadark-radio">
              <input type="radio" name="theme" value="light" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Sáng</span>
                <span class="zadark-switch__hotkeys">
                  &nbsp;<span class="zadark-hotkeys" data-keys-win="Ctrl+D" data-keys-mac="⌘D" data-keys-safari="⌘D"></span>
                </span>
              </span>
            </label>

            <label class="zadark-radio">
              <input type="radio" name="theme" value="dark" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Tối</span>
                <span class="zadark-switch__hotkeys">
                  &nbsp;<span class="zadark-hotkeys" data-keys-win="Ctrl+D" data-keys-mac="⌘D" data-keys-safari="⌘D"></span>
                </span>
              </span>
            </label>

            <label class="zadark-radio">
              <input type="radio" name="theme" value="auto" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Hệ thống</span>
              </span>
            </label>
          </div>

          <div class="font-settings">
            <label class="font-settings__label">
              Phông chữ từ <a href="https://zadark.com/blog/use-google-fonts" target="_blank">Google Fonts</a>
            </label>

            <input id="js-input-font-family" class="zadark-input" placeholder="Mặc định">
          </div>

          <div class="font-settings font-settings--hotkeys">
            <label class="select-font__label">Cỡ chữ của tin nhắn</label>

            <span class="font-settings__hotkeys">
              <span class="zadark-hotkeys" data-keys-win="Ctrl+9 Ctrl+0" data-keys-mac="⌘9 ⌘0" data-keys-safari="⌃9 ⌃0"></span>
            </span>

            <select id="js-select-font-size" class="zadark-select">
              <option value="12">12px</option>
              <option value="13">13px</option>
              <option value="14">14px</option>
              <option value="15">15px</option>
              <option value="16">16px</option>
              <option value="17">17px</option>
              <option value="18">18px</option>
              <option value="19">19px</option>
              <option value="20">20px</option>
              <option value="21">21px</option>
              <option value="22">22px</option>
              <option value="23">23px</option>
              <option value="24">24px</option>
            </select>
          </div>

          <div class="font-settings">
            <label class="font-settings__label" style="flex: 1;">
              Dịch tin nhắn
              <i class="zadark-icon zadark-icon--question" data-tippy-content='<p>Bạn di chuyển chuột vào đoạn tin nhắn và chọn biểu tượng <i class="zadark-icon zadark-icon--translate" style="position: relative; top: 3px; font-size: 18px;"></i> để dịch tin nhắn.</p><p>Bạn có 20 lượt dịch tin nhắn mỗi ngày.</p>'></i>
            </label>

            <select id="js-select-translate-target" class="zadark-select"></select>
          </div>

          <div class="font-settings">
            <label class="font-settings__label" style="flex: 1;">
              Hình nền cuộc trò chuyện
              <i class="zadark-icon zadark-icon--question" data-tippy-content='<p>Chọn một cuộc trò chuyện bất kỳ để thêm hình nền.</p><p>Hình nền được lưu trên trình duyệt của bạn, không đồng bộ với Zalo Mobile và mất khi bạn gỡ cài đặt ZaDark.</p>'></i>
            </label>

            <input type="file" id="js-input-thread-chat-bg" class="zadark-input-file" accept=".jpg, .jpeg, .png" />
            <label for="js-input-thread-chat-bg"></label>

            <button id="js-button-del-thread-chat-bg" class="btn-del" style="margin-left: 12px;">Xoá</button>
          </div>
        </div>
      </div>

      <div class="zadark-panel">
        <div class="zadark-panel__body">
          <div class="zadark-switch__list">
            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-latest-message">
                Ẩn <strong>Tin nhắn gần nhất</strong>
                <i class="zadark-icon zadark-icon--question" data-tippy-content='Để xem nội dung tin nhắn, bạn di chuột vào<br/>"<strong>Tên cuộc trò chuyện</strong>" cần xem'></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+1" data-keys-mac="⌘1" data-keys-safari="⌃1"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-latest-message">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch zadark-switch--border-default">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-thread-chat-message">
                Ẩn <strong>Tin nhắn</strong> trong cuộc trò chuyện
                <i class="zadark-icon zadark-icon--play-circle" data-zdk-intro="hideThreadChatMessage" data-tippy-content="Nhấn vào để xem hướng dẫn"></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+2" data-keys-mac="⌘2" data-keys-safari="⌃2"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-thread-chat-message">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-conv-avatar">
                Ẩn <strong>Ảnh đại diện</strong> cuộc trò chuyện
                <i class="zadark-icon zadark-icon--question" data-tippy-content='Để xem Ảnh đại diện, bạn di chuyển chuột vào<br/>"<strong>Ảnh đại diện</strong>" cần xem'></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+3" data-keys-mac="⌘3" data-keys-safari="⌃3"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-conv-avatar">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch zadark-switch--border-default">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-conv-name">
                Ẩn <strong>Tên</strong> cuộc trò chuyện
                <i class="zadark-icon zadark-icon--question" data-tippy-content='Để xem Tên cuộc trò chuyện, bạn di chuyển chuột vào "<strong>Tên cuộc trò chuyện</strong>" cần xem'></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+7" data-keys-mac="⌘7" data-keys-safari="⌃7"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-conv-name">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-block-typing">
                Ẩn trạng thái <strong>Đang soạn tin</strong>
                <i class="zadark-icon zadark-icon--question" data-tippy-content='Người khác sẽ không thấy trạng thái <strong>Đang soạn tin</strong> của bạn, nhưng bạn vẫn thấy trạng thái của họ. Đây là điểm khác biệt giữa cài đặt từ ZaDark và Zalo.'></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+4" data-keys-mac="⌘4" data-keys-safari="⌃4"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-typing">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-block-delivered">
                Ẩn trạng thái <strong>Đã nhận</strong>
                <i class="zadark-icon zadark-icon--question" data-tippy-content='Người khác sẽ không thấy trạng thái <strong>Đã nhận</strong> tin nhắn của bạn, nhưng bạn vẫn thấy trạng thái của họ. Đây là điểm khác biệt giữa cài đặt từ ZaDark và Zalo.'></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+5" data-keys-mac="⌘5" data-keys-safari="⌃5"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-delivered">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-seen">
                Ẩn trạng thái <strong>Đã xem</strong>
                <i class="zadark-icon zadark-icon--question" data-tippy-content='<p>Người khác sẽ không thấy trạng thái <strong>Đã xem</strong> tin nhắn của bạn, nhưng bạn vẫn thấy trạng thái của họ. Đây là điểm khác biệt giữa cài đặt từ ZaDark và Zalo.</p><p>Tuy nhiên, trạng thái của các tin nhắn bạn đã xem trên Zalo Web sẽ <strong>không được đồng bộ</strong> với máy chủ Zalo, bạn cần phải xem lại tin nhắn trên Zalo Mobile để đồng bộ.</p>'></i>
              </label>
              <span class="zadark-switch__hotkeys">
                <span class="zadark-hotkeys" data-keys-win="Ctrl+6" data-keys-mac="⌘6" data-keys-safari="⌃6"></span>
              </span>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-seen">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="zadark-panel">
        <div class="zadark-panel__body">
          <div class="zadark-switch__list">
            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-use-hotkeys">
                Sử dụng phím tắt
              </label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-use-hotkeys">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const popupFooterHTML = `
    <div class="zadark-popup__footer">
      <a href="https://quaric.com?utm_source=zadark-web" target="_blank" title="ZaDark by Quaric" class="zadark-publisher">
        <span class="zadark-publisher__by">ZaDark by</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 64" fill="none" class="zadark-publisher__lockup"><path fill="currentColor" fill-rule="evenodd" d="M264 64V54h-12.998A24.892 24.892 0 0 0 256 39V25c0-13.807-11.193-25-25-25h-46c-13.807 0-25 11.193-25 25v14c0 13.807 11.193 25 25 25h79Zm-79-54c-8.284 0-15 6.716-15 15v14c0 8.284 6.716 15 15 15h46.019C239.294 53.99 246 47.278 246 39V25c0-8.284-6.716-15-15-15h-46Z" clip-rule="evenodd"/><path fill="currentColor" d="M282 0v39c0 8.284 6.716 15 15 15h37V0h10v64h-47c-13.807 0-25-11.193-25-25V0h10Z"/><path fill="currentColor" fill-rule="evenodd" d="M415 0h-39v10h39c7.948 0 14.452 6.182 14.967 14H380c-11.046 0-20 8.954-20 20s8.954 20 20 20h60V25c0-13.807-11.193-25-25-25Zm-35 34h50v20h-50c-5.523 0-10-4.477-10-10s4.477-10 10-10Z" clip-rule="evenodd"/><path fill="currentColor" d="M456 25c0-13.807 11.193-25 25-25h45v10h-45c-8.284 0-15 6.716-15 15v39h-10V25ZM544 64V0h-10v64h10ZM570 25c0-8.284 6.716-15 15-15h55V0h-55c-13.807 0-25 11.193-25 25v14c0 13.807 11.193 25 25 25h55V54h-55c-8.284 0-15-6.716-15-15V25ZM72 0l44.313 15.783c15.583 5.172 15.583 27.263 0 32.434L72 64V53.338l41.161-14.66c6.416-2.13 6.416-11.226 0-13.356L78.518 12.75 56 64 11.687 48.218c-15.583-5.172-15.583-27.263 0-32.435L56 0v10.662l-41.161 14.66c-6.416 2.13-6.416 11.226 0 13.356L49.482 51.25 72 0Z"/></svg>
      </a>
    </div>
  `

  const zadarkPopupHTML = `
    <div id="js-zadark-popup" class="zadark-popper">
      <div id="zadark-popup">
        <div id="js-zadark-popup__scrollable" class="zadark-popup__scrollable">
          ${popupHeaderHTML}
          ${popupMainHTML}
          ${popupFooterHTML}

          <button id="js-btn-scroll" data-tippy-content="Cuộn xuống">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z" fill="currentColor" /></svg>
          </button>
        </div>
      </div>
    </div>
  `

  const loadBlocking = async (isEnabled = false) => {
    if (!isEnabled) {
      const disabledList = [switchBlockTypingElName, switchBlockSeenElName, switchBlockDeliveredElName]

      disabledList.forEach((elName) => {
        $(elName).parent().parent().addClass('zadark-switch--disabled')
      })

      return
    }

    const ruleIds = await ZaDarkBrowser.sendMessage({ action: MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS })

    if (!Array.isArray(ruleIds)) {
      return
    }

    setSwitch(switchBlockTypingElName, ruleIds.includes('rules_block_typing'))
    setSwitch(switchBlockSeenElName, ruleIds.includes('rules_block_seen'))
    setSwitch(switchBlockDeliveredElName, ruleIds.includes('rules_block_delivered'))
  }

  const loadHotkeys = (isEnabled = true) => {
    if (!isEnabled) {
      hotkeys.unbind()
      return
    }

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
      'command+7',
      'command+4',
      'command+5',
      'command+6',
      'command+0',
      'command+9',
      'command+d',

      // Windows
      'ctrl+1',
      'ctrl+2',
      'ctrl+3',
      'ctrl+7',
      'ctrl+4',
      'ctrl+5',
      'ctrl+6',
      'ctrl+0',
      'ctrl+9',
      'ctrl+d'
    ].join(',')

    hotkeys(keys, async function (event, handler) {
      event.preventDefault()

      const {
        enabledHideLatestMessage,
        enabledHideThreadChatMessage,
        enabledHideConvAvatar,
        enabledHideConvName,

        enabledBlockTyping,
        enabledBlockSeen,
        enabledBlockDelivered
      } = await ZaDarkBrowser.getExtensionSettings()

      switch (handler.key) {
        // Hide latest message
        case 'command+1':
        case 'ctrl+1': {
          hideLatestMessage(!enabledHideLatestMessage)
          return
        }

        // Hide thread chat message
        case 'command+2':
        case 'ctrl+2': {
          hideThreadChatMessage(!enabledHideThreadChatMessage)
          return
        }

        // Hide conversation avatar
        case 'command+3':
        case 'ctrl+3': {
          hideConvAvatar(!enabledHideConvAvatar)
          return
        }

        // Hide conversation name
        case 'command+7':
        case 'ctrl+7': {
          hideConvName(!enabledHideConvName)
          return
        }

        // Block typing
        case 'command+4':
        case 'ctrl+4': {
          setSwitch(switchBlockTypingElName, !enabledBlockTyping)
          handleBlockingRuleChange('rules_block_typing').bind($(switchBlockTypingElName))()
          return
        }

        // Block delivered
        case 'command+5':
        case 'ctrl+5': {
          setSwitch(switchBlockDeliveredElName, !enabledBlockDelivered)
          handleBlockingRuleChange('rules_block_delivered').bind($(switchBlockDeliveredElName))()
          return
        }

        // Block seen
        case 'command+6':
        case 'ctrl+6': {
          setSwitch(switchBlockSeenElName, !enabledBlockSeen)
          handleBlockingRuleChange('rules_block_seen').bind($(switchBlockSeenElName))()
          return
        }

        // Increase font size
        case 'command+0':
        case 'ctrl+0': {
          handleNextFontSize(1)
          return
        }

        // Decrease font size
        case 'command+9':
        case 'ctrl+9': {
          handleNextFontSize(-1)
          return
        }

        // Next theme
        case 'command+d':
        case 'ctrl+d': {
          handleNextTheme()
        }
      }
    })
  }

  const loadPopupState = async () => {
    const {
      theme,
      fontFamily,
      fontSize,
      enabledHideLatestMessage,
      enabledHideConvAvatar,
      enabledHideConvName,
      enabledHideThreadChatMessage
    } = await ZaDarkBrowser.getExtensionSettings()

    // Migration: Convert old fontSize values to new numeric values
    const fontSizeMigrationMap = {
      small: '13',
      medium: '16',
      big: '18',
      'very-big': '20'
    }

    let migratedFontSize = fontSize
    if (fontSizeMigrationMap[fontSize]) {
      migratedFontSize = fontSizeMigrationMap[fontSize]
      // Save migrated value
      await ZaDarkBrowser.saveExtensionSettings({ fontSize: migratedFontSize })
      // Update font size attribute
      ZaDarkUtils.setFontSizeAttr(migratedFontSize)
    }

    setRadioInputTheme(theme)
    setSelect(inputFontFamilyElName, fontFamily)
    setSelect(selectFontSizeElName, migratedFontSize)

    setSwitch(switchHideLatestMessageElName, enabledHideLatestMessage)
    setSwitch(switchHideConvAvatarElName, enabledHideConvAvatar)
    setSwitch(switchHideConvNameElName, enabledHideConvName)
    setSwitch(switchHideThreadChatMessageElName, enabledHideThreadChatMessage)

    loadBlocking(ZaDarkUtils.isSupportDeclarativeNetRequest())
  }

  const loadHotkeysState = async () => {
    const { useHotkeys } = await ZaDarkBrowser.getExtensionSettings()
    setSwitch(switchUseHotkeysElName, useHotkeys)
    loadHotkeys(useHotkeys)
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

  const calcPopupScroll = () => {
    const $element = $(popupScrollableElName)
    const scrolledFromTop = $element.scrollTop()
    const scrollable = $element.prop('scrollHeight') > $element.innerHeight()

    if (!scrollable || scrolledFromTop >= 24) {
      $(btnScrollElName).fadeOut(150)
    } else {
      $(btnScrollElName).fadeIn(150)
    }
  }

  const loadPopupScrollEvent = () => {
    calcPopupScroll()

    $(popupScrollableElName).on('scroll', ZaDarkShared.debounce(calcPopupScroll, 150))
    $(window).on('resize', ZaDarkShared.debounce(calcPopupScroll, 250))

    $(btnScrollElName).on('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
      $(popupScrollableElName).animate({ scrollTop: $(popupScrollableElName).height() }, 1000)
    })
  }

  const loadTranslate = async () => {
    const { translateTarget } = await ZaDarkBrowser.getExtensionSettings()
    $(selectTranslateTargetElName).setLanguagesOptions(translateTarget)
    $(document).enableTranslateMessage(translateTarget)
  }

  const loadThreadChatBg = async () => {
    const settingKey = ZaDarkUtils.getThreadChatBgSettingKey()
    if (!settingKey) {
      ZaDarkUtils.showToast('Không thể tải hình nền vì không xác định được cuộc trò chuyện hiện tại', {
        className: 'toastify--error',
        duration: 3000
      })
      return
    }

    const styleElement = document.getElementById(settingKey)
    let hasImage = true

    if (!styleElement) {
      const settings = await ZaDarkBrowser.getExtensionSettingsLocal({ [settingKey]: '' })
      const imageBase64 = settings[settingKey]
      hasImage = !!imageBase64
      ZaDarkUtils.refreshThreadChatBg(imageBase64)
    }

    const className = 'zadark-input-file--loaded'
    if (hasImage) {
      $(inputThreadChatBgElName).addClass(className)
    } else {
      $(inputThreadChatBgElName).removeClass(className)
    }
  }

  const setZaDarkPopupVisible = (buttonEl, popupEl, visible = true) => {
    if (visible) {
      buttonEl.classList.add('selected')
      popupEl.setAttribute('data-visible', '')
    } else {
      buttonEl.classList.remove('selected')
      popupEl.removeAttribute('data-visible')
    }
  }

  const handleOpenZaDarkPopup = (buttonEl, popupEl) => {
    return () => {
      loadPopupState()
      updateKnownVersionState(buttonEl)

      setZaDarkPopupVisible(buttonEl, popupEl, true)
      calcPopupScroll()
    }
  }

  const handleCloseZaDarkPopup = (buttonEl, popupEl) => {
    return (event) => {
      const isOpen = popupEl.getAttribute('data-visible') !== null
      const isClickOutside = isOpen && !popupEl.contains(event.target) && !buttonEl.contains(event.target)

      if (!isClickOutside) {
        return
      }

      setZaDarkPopupVisible(buttonEl, popupEl, false)
    }
  }

  // const injectAppDiv = () => {
  //   const isRendered = !!document.querySelector('zadark-settings-app')

  //   if (isRendered) {
  //     return
  //   }

  //   // Inject app div
  //   const appContainer = document.createElement('zadark-settings-app')
  //   document.body.appendChild(appContainer)

  //   // Create shadow dom
  //   const shadow = document
  //     .querySelector('zadark-settings-app')
  //     .attachShadow({ mode: 'open' })

  //   const wrapper = document.createElement('div')
  //   wrapper.id = 'zadark-settings-wrapper'
  //   shadow.appendChild(wrapper)
  // }

  // const getSettingsWrapper = () => {
  //   const el = document.querySelector('zadark-settings-app').shadowRoot.querySelector('#zadark-settings-wrapper')
  //   return el
  // }

  // injectAppDiv()
  // const settingsWrapper = getSettingsWrapper()
  // settingsWrapper.innerHTML = `
  //   <style>
  //     @import "${ZaDarkBrowser.getURL('css/zadark-fonts.min.css')}";
  //     @import "${ZaDarkBrowser.getURL('css/zadark-popup.min.css')}";
  //     @import "${ZaDarkBrowser.getURL('css/popup.min.css')}";

  //     #zadark-popup {
  //       border: 1px solid var(--zadark-border-base);
  //     }
  //   </style>
  //   `

  const loadZaDarkPopup = () => {
    const [zaloTabsBottomEl] = document.querySelectorAll('.nav__tabs__bottom')

    if (!zaloTabsBottomEl) {
      return
    }

    zaloTabsBottomEl.insertAdjacentHTML('afterbegin', zadarkButtonHTML)

    const zaloAppBody = document.body
    zaloAppBody.insertAdjacentHTML('beforeend', zadarkPopupHTML)

    // const settingsWrapper = getSettingsWrapper()
    // settingsWrapper.insertAdjacentHTML('beforeend', zadarkPopupHTML)

    $(radioInputThemeElName).on('change', function () {
      const theme = $(this).val()
      updateTheme(theme)
    })

    $(inputFontFamilyElName).keypress(handleInputFontFamilyKeyPress)

    $(selectFontSizeElName).on('change', function () {
      const fontSize = $(this).val()
      updateFontSize(fontSize)
    })

    $(selectTranslateTargetElName).on('change', function () {
      const translateTarget = $(this).val()
      updateTranslateTarget(translateTarget)
    })

    $(inputThreadChatBgElName).on('click', function (e) {
      const convId = ZaDarkUtils.getCurrentConvId()
      if (convId) return

      e.preventDefault()
      ZaDarkUtils.showToast('Chọn một cuộc trò chuyện để đặt hình nền')
    })

    $(inputThreadChatBgElName).on('change', function () {
      const file = this.files[0]

      if (!file) {
        return
      }

      if (file.size > 4 * 1024 * 1024) {
        ZaDarkUtils.showToast('Dung lượng ảnh tối đa là 4MB', {
          className: 'toastify--error',
          duration: 3000
        })
        return
      }

      ZaDarkShared.convertImageToBase64(file)
        .then((imageBase64) => {
          ZaDarkUtils.updateThreadChatBg(imageBase64)
          $(this).addClass('zadark-input-file--loaded')
        }).catch((error) => {
          ZaDarkUtils.showToast(`Lỗi khi tải ảnh: ${error.message}`)
        })
    })

    $(buttonDelThreadChatBgElName).on('click', function () {
      ZaDarkUtils.updateThreadChatBg('')
      $(inputThreadChatBgElName).removeClass('zadark-input-file--loaded')
    })

    $(switchHideLatestMessageElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      hideLatestMessage(isEnabled)
    })

    $(switchHideConvAvatarElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      hideConvAvatar(isEnabled)
    })

    $(switchHideConvNameElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      hideConvName(isEnabled)
    })

    $(switchHideThreadChatMessageElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      hideThreadChatMessage(isEnabled)
    })

    $(switchBlockTypingElName).on('change', handleBlockingRuleChange('rules_block_typing'))
    $(switchBlockSeenElName).on('change', handleBlockingRuleChange('rules_block_seen'))
    $(switchBlockDeliveredElName).on('change', handleBlockingRuleChange('rules_block_delivered'))

    $(switchUseHotkeysElName).on('change', handleUseHotkeysChange)

    const popupEl = document.querySelector('#js-zadark-popup')
    const buttonEl = document.getElementById('div_Main_TabZaDark')

    buttonEl.addEventListener('click', handleOpenZaDarkPopup(buttonEl, popupEl))

    const closeEventNames = ['click', 'contextmenu']
    closeEventNames.forEach((eventName) => {
      window.addEventListener(
        eventName,
        handleCloseZaDarkPopup(buttonEl, popupEl),
        true
      )
    })

    loadPopupState()
    loadHotkeysState()
    loadKnownVersionState(buttonEl)
    loadPopupScrollEvent()
    loadTranslate()

    ZaDarkUtils.initTippy()

    $('[data-zdk-intro]').on('click', function (e) {
      e.preventDefault()
      e.stopPropagation()

      const introId = $(this).data('zdk-intro')
      const isInThreadChat = $('#chatViewContainer').length > 0

      const REQUIRED_IN_THREAD_CHAT = [
        'hideThreadChatMessage'
      ]

      if (REQUIRED_IN_THREAD_CHAT.includes(introId) && !isInThreadChat) {
        ZaDarkUtils.showToast('Chọn một cuộc trò chuyện để xem hướng dẫn')
        return
      }

      setZaDarkPopupVisible(buttonEl, popupEl, false)

      const introOptions = {
        onExit: () => setZaDarkPopupVisible(buttonEl, popupEl, true),
        onComplete: () => setZaDarkPopupVisible(buttonEl, popupEl, true)
      }

      if (introId === 'hideThreadChatMessage') {
        ZaDarkUtils.showIntroHideThreadChatMessage(introOptions)
      }
    })

    document.addEventListener('@ZaDark:CONV_ID_CHANGE', function () {
      loadThreadChatBg()
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

  const updateTheme = (theme = 'dark') => {
    setRadioInputTheme(theme)
    ZaDarkUtils.updateTheme(theme)
  }

  const updateFontSize = (fontSize = '16') => {
    setSelect(selectFontSizeElName, fontSize)
    ZaDarkUtils.updateFontSize(fontSize)
  }

  const updateTranslateTarget = (translateTarget = 'none') => {
    setSelect(selectTranslateTargetElName, translateTarget)
    ZaDarkUtils.updateTranslateTarget(translateTarget)

    $(document).disableTranslateMessage()
    if (translateTarget !== 'none') {
      $(document).enableTranslateMessage(translateTarget)
    }
  }

  const hideLatestMessage = (isEnabled) => {
    setSwitch(switchHideLatestMessageElName, isEnabled)
    ZaDarkUtils.updateHideLatestMessage(isEnabled)
  }

  const hideConvAvatar = (isEnabled) => {
    setSwitch(switchHideConvAvatarElName, isEnabled)
    ZaDarkUtils.updateHideConvAvatar(isEnabled)
  }

  const hideConvName = (isEnabled) => {
    setSwitch(switchHideConvNameElName, isEnabled)
    ZaDarkUtils.updateHideConvName(isEnabled)
  }

  const hideThreadChatMessage = (isEnabled) => {
    setSwitch(switchHideThreadChatMessageElName, isEnabled)
    ZaDarkUtils.updateHideThreadChatMessage(isEnabled)
  }

  const useHotkeys = (isEnabled) => {
    setSwitch(switchUseHotkeysElName, isEnabled)
    loadHotkeys(isEnabled)
    ZaDarkUtils.updateUseHotkeys(isEnabled)
  }

  const MSG_ACTIONS = ZaDarkUtils.MSG_ACTIONS

  ZaDarkBrowser.addMessageListener((message, sender, sendResponse) => {
    if (message.action === MSG_ACTIONS.CHANGE_THEME) {
      const { theme } = message.payload
      updateTheme(theme)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_FONT_SIZE) {
      const { fontSize } = message.payload
      updateFontSize(fontSize)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_TRANSLATE_TARGET) {
      const { translateTarget } = message.payload
      updateTranslateTarget(translateTarget)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_LATEST_MESSAGE) {
      const { isEnabled } = message.payload
      hideLatestMessage(isEnabled)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_CONV_AVATAR) {
      const { isEnabled } = message.payload
      hideConvAvatar(isEnabled)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_CONV_NAME) {
      const { isEnabled } = message.payload
      hideConvName(isEnabled)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_HIDE_THREAD_CHAT_MESSAGE) {
      const { isEnabled } = message.payload
      hideThreadChatMessage(isEnabled)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.CHANGE_USE_HOTKEYS) {
      const { isEnabled } = message.payload
      useHotkeys(isEnabled)
      sendResponse({ received: true })
    }

    if (message.action === MSG_ACTIONS.REFRESH_ZALO_TABS) {
      window.location.reload()
      sendResponse({ received: true })
    }

    if (message.action === 'ncdai') {
      console.log('conv', message.payload)
      // window.location.reload()
      sendResponse({ received: true })
    }
  })
})()
