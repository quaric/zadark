/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

(function () {
  const { ipcRenderer } = require('electron')
  const $ = require('./zadark-jquery.min.js')
  const Hotkeys = require('./zadark-hotkeys-js.min.js')
  const Toastify = require('./zadark-toastify.min.js')
  const WebFont = require('./zadark-webfont.min.js')

  const ZADARK_THEME_KEY = '@ZaDark:THEME'
  const ZADARK_FONT_FAMILY_KEY = '@ZaDark:FONT_FAMILY'
  const ZADARK_FONT_SIZE_KEY = '@ZaDark:FONT_SIZE'

  const ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_LATEST_MESSAGE'
  const ZADARK_ENABLED_HIDE_CONV_AVATAR_NAME_KEY = '@ZaDark:ENABLED_HIDE_CONV_AVATAR_NAME'
  const ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_THREAD_CHAT_MESSAGE'
  const ZADARK_ENABLED_BLOCK_TYPING_KEY = '@ZaDark:ENABLED_BLOCK_TYPING'
  const ZADARK_ENABLED_BLOCK_DELIVERED_KEY = '@ZaDark:ENABLED_BLOCK_DELIVERED'
  const ZADARK_ENABLED_BLOCK_SEEN_KEY = '@ZaDark:ENABLED_BLOCK_SEEN'

  const BLOCK_IDS = ['block_typing', 'block_delivered', 'block_seen', 'block_online']
  const BLOCK_STORAGE_KEYS = {
    block_typing: ZADARK_ENABLED_BLOCK_TYPING_KEY,
    block_delivered: ZADARK_ENABLED_BLOCK_DELIVERED_KEY,
    block_seen: ZADARK_ENABLED_BLOCK_SEEN_KEY
  }

  const ZADARK_KNOWN_VERSION_KEY = '@ZaDark:KNOWN_VERSION'

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
    block_typing: {
      true: 'BẬT : Ẩn trạng thái Đang soạn tin (Typing) ...',
      false: 'TẮT : Ẩn trạng thái Đang soạn tin (Typing) ...'
    },
    block_delivered: {
      true: 'BẬT : Ẩn trạng thái Đã nhận (Received)',
      false: 'TẮT : Ẩn trạng thái Đã nhận (Received)'
    },
    block_seen: {
      true: 'BẬT : Ẩn trạng thái Đã xem (Seen)',
      false: 'TẮT : Ẩn trạng thái Đã xem (Seen)'
    }
  }

  const ZaDarkStorage = {
    getTheme: () => {
      return localStorage.getItem(ZADARK_THEME_KEY) || 'dark'
    },

    saveTheme: (theme) => {
      return localStorage.setItem(ZADARK_THEME_KEY, theme)
    },

    getFontFamily: () => {
      const value = localStorage.getItem(ZADARK_FONT_FAMILY_KEY)

      if (value === null) {
        return 'Open Sans'
      }

      return value
    },

    saveFontFamily: (font) => {
      return localStorage.setItem(ZADARK_FONT_FAMILY_KEY, font)
    },

    getFontSize: () => {
      return localStorage.getItem(ZADARK_FONT_SIZE_KEY) || 'medium'
    },

    saveFontSize: (fontSize) => {
      return localStorage.setItem(ZADARK_FONT_SIZE_KEY, fontSize)
    },

    saveEnabledHideLatestMessage: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY, isEnabled)
    },

    getEnabledHideLatestMessage: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY) === 'true'
    },

    saveEnabledHideConvAvatarName: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_CONV_AVATAR_NAME_KEY, isEnabled)
    },

    getEnabledHideConvAvatarName: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_CONV_AVATAR_NAME_KEY) === 'true'
    },

    saveEnabledHideThreadChatMessage: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY, isEnabled)
    },

    getEnabledHideThreadChatMessage: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY) === 'true'
    },

    saveBlockSettings: (blockId, isEnabled) => {
      const key = BLOCK_STORAGE_KEYS[blockId]
      if (key) {
        return localStorage.setItem(key, isEnabled)
      }
    },

    getBlockSettings: () => {
      return {
        block_typing: localStorage.getItem(ZADARK_ENABLED_BLOCK_TYPING_KEY) === 'true',
        block_delivered: localStorage.getItem(ZADARK_ENABLED_BLOCK_DELIVERED_KEY) === 'true',
        block_seen: localStorage.getItem(ZADARK_ENABLED_BLOCK_SEEN_KEY) === 'true'
      }
    },

    getKnownVersion: () => {
      return localStorage.getItem(ZADARK_KNOWN_VERSION_KEY) || '0.0'
    },

    saveKnownVersion: (version) => {
      return localStorage.setItem(ZADARK_KNOWN_VERSION_KEY, version)
    }
  }

  const ZaDarkUtils = {
    HOTKEYS_TOAST_MESSAGE: {
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
    },

    isMac: () => {
      return document.documentElement.getAttribute('data-zadark-os') === 'macOS'
    },

    setThemeAttr: (themeMode) => {
      document.documentElement.setAttribute('data-zadark-theme', themeMode)
    },

    setFontFamilyAttr: (fontFamily) => {
      if (!fontFamily) {
        document.querySelector(':root').style.removeProperty('--zadark-font-family')
        document.documentElement.removeAttribute('data-zadark-use-font')
        return
      }

      document.querySelector(':root').style.setProperty('--zadark-font-family', fontFamily)
      document.documentElement.setAttribute('data-zadark-use-font', 'true')
    },

    setFontSizeAttr: (fontSize) => {
      document.documentElement.setAttribute('data-zadark-font-size', fontSize)
    },

    toggleBodyClassName: (className, isEnabled) => {
      if (isEnabled) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
      }
    },

    setHideLatestMessageAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--latest-message', isEnabled)
    },

    setHideConvAvatarNameAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--conv-avatar-name', isEnabled)
    },

    setHideThreadChatMessageAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--thread-chat-message', isEnabled)
    },

    setPageTheme: function (theme) {
      switch (theme) {
        case 'light':
        case 'dark': {
          this.setThemeAttr(theme)
          return
        }

        case 'auto': {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          this.setThemeAttr(isDark ? 'dark' : 'light')
          return
        }

        default: {
          this.setThemeAttr('dark')
        }
      }
    },

    initBlockSettings: function () {
      const settings = ZaDarkStorage.getBlockSettings()

      const enableBlockIds = []
      const disableBlockIds = []

      BLOCK_IDS.forEach((blockId) => {
        if (settings[blockId]) {
          enableBlockIds.push(blockId)
        } else {
          disableBlockIds.push(blockId)
        }
      })

      ipcRenderer.send('@ZaDark:UPDATE_BLOCK_SETTINGS', {
        enableBlockIds,
        disableBlockIds
      })
    },

    getRatingURL: function () {
      return 'https://sourceforge.net/projects/zadark/reviews/new?stars=5'
    },

    showToast: function (message, options = {}) {
      const toast = Toastify({
        text: message,
        duration: 1408,
        gravity: 'bottom',
        position: 'center',
        escapeMarkup: false,
        offset: {
          x: 15,
          y: 15
        },
        ...options,
        onClick: function () {
          toast.hideToast()
        }
      })
      toast.showToast()

      return toast
    },

    setSelect: (elName, value) => {
      $(elName).val(value)
    },

    setSwitch: (elName, enabled) => {
      $(elName).prop('checked', enabled)
    },

    installFontFamily: (fontFamilies = [], classes = true) => {
      if (!fontFamilies.length) {
        return Promise.resolve(false)
      }

      return new Promise((resolve) => {
        WebFont.load({
          google: {
            families: fontFamilies
            // text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZẮắẰằẲẳẴẵẶặĂăÂâĐđÊêÔôƠơƯưỨứỪừỬửỮữỰự'
          },
          loading: () => {
            console.log('Fonts are being loaded', fontFamilies)
          },
          active: () => {
            console.log('Fonts have been rendered', fontFamilies)
            resolve(true)
          },
          inactive: () => {
            console.log('Fonts failed to load', fontFamilies)
            resolve(false)
          },
          classes,
          timeout: 1408
        })
      })
    },

    initFontFamily: async function () {
      const fontFamily = ZaDarkStorage.getFontFamily()
      console.log('🚀 ~ file: zadark.js:319 ~ fontFamily:', fontFamily)

      if (!fontFamily) {
        this.installFontFamily(['Open Sans:400,600:latin,vietnamese'], false)
        return
      }

      await this.installFontFamily([`${fontFamily}:400,500:latin,vietnamese`, 'Open Sans:400,600:latin,vietnamese'], false)
      this.setFontFamilyAttr(fontFamily)
    },

    initPageSettings: async function () {
      this.initFontFamily()
      this.initBlockSettings()

      const theme = ZaDarkStorage.getTheme()
      this.setPageTheme(theme)

      const fontSize = ZaDarkStorage.getFontSize()
      this.setFontSizeAttr(fontSize)

      const enabledHideLatestMessage = ZaDarkStorage.getEnabledHideLatestMessage()
      this.setHideLatestMessageAttr(enabledHideLatestMessage)

      const enabledHideConvAvatarName = ZaDarkStorage.getEnabledHideConvAvatarName()
      this.setHideConvAvatarNameAttr(enabledHideConvAvatarName)

      const enabledHideThreadChatMessage = ZaDarkStorage.getEnabledHideThreadChatMessage()
      this.setHideThreadChatMessageAttr(enabledHideThreadChatMessage)
    },

    updateTheme: function (theme) {
      ZaDarkStorage.saveTheme(theme)
      this.setPageTheme(theme)

      if (!this.isMac()) {
        ipcRenderer.send('@ZaDark:UPDATE_SETTINGS', { theme })
      }
    },

    updateFontFamily: async function (fontFamily) {
      if (!fontFamily) {
        // Use default font
        ZaDarkStorage.saveFontFamily('')
        this.setFontFamilyAttr('')
        this.showToast('Đã thay đổi phông chữ')
        return true
      }

      const toast = this.showToast('Đang tải phông chữ...', { duration: -1 })

      const success = await this.installFontFamily([`${fontFamily}:400,500:latin,vietnamese`], false)

      toast.hideToast()

      if (!success) {
        this.showToast('Không thể tải phông chữ')
        return false
      }

      ZaDarkStorage.saveFontFamily(fontFamily)

      this.setFontFamilyAttr(fontFamily)
      this.showToast('Đã thay đổi phông chữ')

      return true
    },

    updateFontSize: function (fontSize) {
      ZaDarkStorage.saveFontSize(fontSize)
      this.setFontSizeAttr(fontSize)
      ZaDarkUtils.showToast(ZaDarkUtils.HOTKEYS_TOAST_MESSAGE.fontSize[fontSize])
    },

    updateHideLatestMessage: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideLatestMessage(isEnabled)
      this.toggleBodyClassName('zadark-prv--latest-message', isEnabled)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideLatestMessage[isEnabled])

      if (!this.isMac()) {
        ipcRenderer.send('@ZaDark:UPDATE_SETTINGS', { hideLatestMessage: isEnabled })
      }
    },

    updateHideConvAvatarName: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideConvAvatarName(isEnabled)
      this.toggleBodyClassName('zadark-prv--conv-avatar-name', isEnabled)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.HideConvAvatarName[isEnabled])

      if (!this.isMac()) {
        ipcRenderer.send('@ZaDark:UPDATE_SETTINGS', { hideConvAvatarName: isEnabled })
      }
    },

    updateHideThreadChatMessage: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideThreadChatMessage(isEnabled)
      this.toggleBodyClassName('zadark-prv--thread-chat-message', isEnabled)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideThreadChatMessage[isEnabled])
    },

    updateBlockSettings: function (blockId, isEnabled) {
      const payload = isEnabled
        ? { enableBlockIds: [blockId] }
        : { disableBlockIds: [blockId] }

      ZaDarkStorage.saveBlockSettings(blockId, isEnabled)
      ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE[blockId][isEnabled])

      ipcRenderer.send('@ZaDark:UPDATE_BLOCK_SETTINGS', payload)
    }
  }

  ZaDarkUtils.initPageSettings()

  window.matchMedia('(prefers-color-scheme: dark)').addListener((event) => {
    const theme = ZaDarkStorage.getTheme()
    if (theme === 'auto') {
      ZaDarkUtils.setThemeAttr(event.matches ? 'dark' : 'light')
    }
  })

  const versionElName = '#js-ext-version'
  const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]'
  const inputFontFamilyElName = '#js-input-font-family'
  const selectFontSizeElName = '#js-select-font-size'

  const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
  const switchHideConvAvatarNameElName = '#js-switch-hide-conv-avatar-name'
  const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  const setRadioInputTheme = (theme) => {
    const options = ['light', 'dark', 'auto']
    options.forEach((option) => {
      $(radioInputThemeElName).filter(`[value="${option}"]`).prop('checked', option === theme)
    })
  }

  function handleThemeChange () {
    const theme = $(this).val()
    ZaDarkUtils.updateTheme(theme)
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

  function handleFontSizeChange () {
    const fontSize = $(this).val()
    ZaDarkUtils.updateFontSize(fontSize)
  }

  function handleHideLastestMessageChange () {
    const isEnabled = $(this).is(':checked')
    ZaDarkUtils.updateHideLatestMessage(isEnabled)
  }

  function handleHideConvAvatarNameChange () {
    const isEnabled = $(this).is(':checked')
    ZaDarkUtils.updateHideConvAvatarName(isEnabled)
  }

  function handleHideThreadChatMessageChange () {
    const isEnabled = $(this).is(':checked')
    ZaDarkUtils.updateHideThreadChatMessage(isEnabled)
  }

  const handleBlockSettingsChange = (blockId) => {
    return () => {
      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateBlockSettings(blockId, isEnabled)
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
          <img src="zadark-lockup.svg" alt="ZaDark" class="zadark-popup__header__logo-img" />
        </a>
      </div>

      <div class="zadark-popup__header__menu-list">
        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="${ZaDarkUtils.getRatingURL()}" title="Bình chọn" target="_blank">Bình chọn</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.canny.io" title="Phản hồi" target="_blank">Phản hồi</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.quaric.com/blog/changelog" id="js-ext-version" title="Có gì mới trong phiên bản này?" target="_blank"></a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-coffee">
          <a href="https://zadark.quaric.com/donate" title="Donate" target="_blank">
            <img src="zadark-coffee.png" alt="Donate" />
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

          <div class="font-settings font-settings--border-default">
            <label class="font-settings__label">
              Phông chữ từ <a href="https://zadark.quaric.com/blog/use-google-fonts" target="_blank">Google Fonts</a>
              <span class="zadark-beta"></span>
            </label>

            <input id="js-input-font-family" class="zadark-input" placeholder="Mặc định">
          </div>

          <div class="font-settings font-settings--hotkeys">
            <label class="select-font__label">Cỡ chữ của tin nhắn</label>

            <span class="font-settings__hotkeys">
              <span class="zadark-hotkeys" data-keys-win="Ctrl+9 / Ctrl+0" data-keys-mac="⌘9 / ⌘0"></span>
            </span>

            <select id="js-select-font-size" class="zadark-select">
              <option value="small">Nhỏ</option>
              <option value="medium">Trung bình</option>
              <option value="big">Lớn</option>
              <option value="very-big">Rất lớn</option>
            </select>
          </div>
        </div>
      </div>

      <div id="js-panel-privacy" class="not-available">
        <label class="zadark-form__label">Riêng tư</label>

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
        <img src="quaric-lockup-dark.svg" class="zadark-publisher__lockup zadark-publisher__lockup--dark">
        <img src="quaric-lockup-light.svg" class="zadark-publisher__lockup zadark-publisher__lockup--light">
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

  const loadPopupState = () => {
    const theme = ZaDarkStorage.getTheme()
    setRadioInputTheme(theme)

    const fontFamily = ZaDarkStorage.getFontFamily()
    ZaDarkUtils.setSelect(inputFontFamilyElName, fontFamily)

    const fontSize = ZaDarkStorage.getFontSize()
    ZaDarkUtils.setSelect(selectFontSizeElName, fontSize)

    const enabledHideLatestMessage = ZaDarkStorage.getEnabledHideLatestMessage()
    ZaDarkUtils.setSwitch(switchHideLatestMessageElName, enabledHideLatestMessage)

    const enabledHideConvAvatarName = ZaDarkStorage.getEnabledHideConvAvatarName()
    ZaDarkUtils.setSwitch(switchHideConvAvatarNameElName, enabledHideConvAvatarName)

    const enabledHideThreadChatMessage = ZaDarkStorage.getEnabledHideThreadChatMessage()
    ZaDarkUtils.setSwitch(switchHideThreadChatMessageElName, enabledHideThreadChatMessage)

    const blockSettings = ZaDarkStorage.getBlockSettings()
    ZaDarkUtils.setSwitch(switchBlockTypingElName, blockSettings.block_typing)
    ZaDarkUtils.setSwitch(switchBlockDeliveredElName, blockSettings.block_delivered)
    ZaDarkUtils.setSwitch(switchBlockSeenElName, blockSettings.block_seen)
  }

  const loadKnownVersionState = (buttonEl) => {
    const knownVersion = ZaDarkStorage.getKnownVersion()
    const zadarkVersion = $('html').data('zadark-version')

    if (`${knownVersion}` !== `${zadarkVersion}`) {
      buttonEl.classList.add('zadark-known-version')
    }
  }

  const updateKnownVersionState = (buttonEl) => {
    const zadarkVersion = $('html').data('zadark-version')
    ZaDarkStorage.saveKnownVersion(zadarkVersion)

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

  const handleNextFontSize = (count) => {
    const fontSize = ZaDarkStorage.getFontSize()

    const fontSizes = ['small', 'medium', 'big', 'very-big']

    const nextIndex = count > 0
      ? Math.min(fontSizes.indexOf(fontSize) + 1, fontSizes.length - 1)
      : Math.max(fontSizes.indexOf(fontSize) - 1, 0)

    const nextFontSize = fontSizes[nextIndex]

    ZaDarkUtils.setSelect(selectFontSizeElName, nextFontSize)
    handleFontSizeChange.bind($(selectFontSizeElName))()
  }

  const loadHotkeys = () => {
    Hotkeys.filter = function (event) {
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
      'command+0',
      'command+9',
      'command+d',

      // Windows
      'ctrl+1',
      'ctrl+2',
      'ctrl+3',
      'ctrl+4',
      'ctrl+5',
      'ctrl+6',
      'ctrl+0',
      'ctrl+9',
      'ctrl+d'
    ].join(',')

    Hotkeys(keys, function (event, handler) {
      event.preventDefault()

      const enabledHideLatestMessage = ZaDarkStorage.getEnabledHideLatestMessage()
      const enabledHideConvAvatarName = ZaDarkStorage.getEnabledHideConvAvatarName()
      const enabledHideThreadChatMessage = ZaDarkStorage.getEnabledHideThreadChatMessage()
      const blockSettings = ZaDarkStorage.getBlockSettings()

      switch (handler.key) {
        // Hide latest message
        case 'command+1':
        case 'ctrl+1': {
          ZaDarkUtils.setSwitch(switchHideLatestMessageElName, !enabledHideLatestMessage)
          handleHideLastestMessageChange.bind($(switchHideLatestMessageElName))()
          return
        }

        // Hide thread chat message
        case 'command+2':
        case 'ctrl+2': {
          ZaDarkUtils.setSwitch(switchHideThreadChatMessageElName, !enabledHideThreadChatMessage)
          handleHideThreadChatMessageChange.bind($(switchHideThreadChatMessageElName))()
          return
        }

        // Hide conversation avatar & name
        case 'command+3':
        case 'ctrl+3': {
          ZaDarkUtils.setSwitch(switchHideConvAvatarNameElName, !enabledHideConvAvatarName)
          handleHideConvAvatarNameChange.bind($(switchHideConvAvatarNameElName))()
          return
        }

        // Block typing
        case 'command+4':
        case 'ctrl+4': {
          ZaDarkUtils.setSwitch(switchBlockTypingElName, !blockSettings.block_typing)
          handleBlockSettingsChange('block_typing').bind($(switchBlockTypingElName))()
          return
        }

        // Block delivered
        case 'command+5':
        case 'ctrl+5': {
          ZaDarkUtils.setSwitch(switchBlockDeliveredElName, !blockSettings.block_delivered)
          handleBlockSettingsChange('block_delivered').bind($(switchBlockDeliveredElName))()
          return
        }

        // Block seen
        case 'command+6':
        case 'ctrl+6': {
          ZaDarkUtils.setSwitch(switchBlockSeenElName, !blockSettings.block_seen)
          handleBlockSettingsChange('block_seen').bind($(switchBlockSeenElName))()
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

        // Open ZaDark Settings
        case 'command+d':
        case 'ctrl+d': {
          const buttonEl = document.getElementById('div_Main_TabZaDark')
          buttonEl.click()
        }
      }
    })
  }

  const loadTippy = () => {
    tippy('[data-tippy-content]', {
      theme: 'zadark',
      allowHTML: true
    })

    tippy('#div_Main_TabZaDark', {
      theme: 'zadark',
      allowHTML: true,
      content: '<span>ZaDark <span class="zadark-hotkeys" data-keys-win="Ctrl+D" data-keys-mac="⌘D"></span></span>',
      placement: 'right'
    })

    tippy('#js-input-font-family', {
      theme: 'zadark',
      allowHTML: true,
      content: '<p>Nhập tên phông chữ từ <strong>Google Fonts</strong><br>(Lưu ý kí tự in hoa, khoảng cách).</p><p>Bỏ trống nếu dùng phông mặc định.</p><p>Nhấn <strong>Enter</strong> để lưu lại.</p>',
      trigger: 'focus'
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

    const zadarkVersion = $('html').data('zadark-version')
    $(versionElName).html(`Phiên bản ${zadarkVersion}`)

    $(radioInputThemeElName).on('change', handleThemeChange)
    $(inputFontFamilyElName).keypress(handleInputFontFamilyKeyPress)
    $(selectFontSizeElName).on('change', handleFontSizeChange)

    $(switchHideLatestMessageElName).on('change', handleHideLastestMessageChange)
    $(switchHideConvAvatarNameElName).on('change', handleHideConvAvatarNameChange)
    $(switchHideThreadChatMessageElName).on('change', handleHideThreadChatMessageChange)

    $(switchBlockTypingElName).on('change', handleBlockSettingsChange('block_typing'))
    $(switchBlockSeenElName).on('change', handleBlockSettingsChange('block_seen'))
    $(switchBlockDeliveredElName).on('change', handleBlockSettingsChange('block_delivered'))

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
    loadTippy()
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
})()
