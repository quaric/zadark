/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

(function (global) {
  const ZaDarkUtils = {
    MSG_ACTIONS: {
      CHANGE_THEME: '@ZaDark:CHANGE_THEME',
      CHANGE_FONT_SIZE: '@ZaDark:CHANGE_FONT_SIZE',
      CHANGE_TRANSLATE_TARGET: '@ZaDark:CHANGE_TRANSLATE_TARGET',

      CHANGE_HIDE_LATEST_MESSAGE: '@ZaDark:CHANGE_HIDE_LATEST_MESSAGE',
      CHANGE_HIDE_CONV_AVATAR: '@ZaDark:CHANGE_HIDE_CONV_AVATAR',
      CHANGE_HIDE_CONV_NAME: '@ZaDark:CHANGE_HIDE_CONV_NAME',
      CHANGE_HIDE_THREAD_CHAT_MESSAGE: '@ZaDark:CHANGE_HIDE_THREAD_CHAT_MESSAGE',

      GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
      UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS',

      REFRESH_ZALO_TABS: '@ZaDark:REFRESH_ZALO_TABS',
      CHANGE_USE_HOTKEYS: '@ZaDark:CHANGE_USE_HOTKEYS'
    },

    HOTKEYS_TOAST_MESSAGE: {
      fontSize: function (fontSize) {
        return `Đã áp dụng cỡ chữ ${fontSize}px`
      },
      hideLatestMessage: {
        true: 'Đã bật Ẩn Tin nhắn gần nhất',
        false: 'Đã tắt Ẩn Tin nhắn gần nhất'
      },
      hideThreadChatMessage: {
        true: 'Đã bật Ẩn Tin nhắn trong cuộc trò chuyện',
        false: 'Đã tắt Ẩn Tin nhắn trong cuộc trò chuyện'
      },
      hideConvAvatar: {
        true: 'Đã bật Ẩn Ảnh đại diện',
        false: 'Đã tắt Ẩn Ảnh đại diện'
      },
      hideConvName: {
        true: 'Đã bật Ẩn Tên cuộc trò chuyện',
        false: 'Đã tắt Ẩn Tên cuộc trò chuyện'
      },
      rules_block_typing: {
        true: 'Đã bật Ẩn trạng thái Đang soạn tin',
        false: 'Đã tắt Ẩn trạng thái Đang soạn tin'
      },
      rules_block_delivered: {
        true: 'Đã bật Ẩn trạng thái Đã nhận',
        false: 'Đã tắt Ẩn trạng thái Đã nhận'
      },
      rules_block_seen: {
        true: 'Đã bật Ẩn trạng thái Đã xem',
        false: 'Đã tắt Ẩn trạng thái Đã xem'
      },
      useHotkeys: {
        true: 'Đã kích hoạt phím tắt',
        false: 'Đã vô hiệu hoá phím tắt'
      }
    },

    getCurrentConvId: () => {
      return document.body.getAttribute('data-current-conv-id')
    },

    toggleBodyClassName: (className, isEnabled) => {
      if (isEnabled) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
      }
    },

    setOSAttr: (os) => {
      document.documentElement.setAttribute('data-zadark-os', os)
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

    setHideLatestMessageAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--latest-message', isEnabled)
    },

    setHideConvAvatarAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--conv-avatar', isEnabled)
    },

    setHideConvNameAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--conv-name', isEnabled)
    },

    setHideThreadChatMessageAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark-prv--thread-chat-message', isEnabled)
    },

    setUseHotkeysAttr: function (isEnabled) {
      this.toggleBodyClassName('zadark--use-hotkeys', isEnabled)
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

    showIntro: ({ steps = [], onExit, onComplete } = {}) => {
      const intro = introJs().setOptions({
        steps,

        disableInteraction: false,
        prevLabel: 'Trước',
        nextLabel: 'Tiếp',
        doneLabel: 'Đã hiểu',
        helperElementPadding: -4
      })

      if (typeof onExit === 'function') {
        intro.onexit(onExit)
      }

      if (typeof onComplete === 'function') {
        intro.oncomplete(onComplete)
      }

      intro.start()
    },

    isSupportDeclarativeNetRequest: () => {
      const { parsedResult: { browser } } = bowser.getParser(window.navigator.userAgent)

      const browserName = browser.name
      const browserVersion = parseFloat(browser.version)

      // Chrome (Chromium) 84+ supports Declarative Net Request WebExtensions API
      if (['Chrome', 'Microsoft Edge'].includes(browserName) && browserVersion >= 84) {
        return true
      }

      // Safari 15+ supports Declarative Net Request WebExtensions API
      if (browserName === 'Safari' && browserVersion >= 15) {
        return true
      }

      // Firefox 113+ supports Declarative Net Request WebExtensions API
      if (browserName === 'Firefox' && browserVersion >= 113) {
        return true
      }

      return false
    },

    getRatingURL: (platformName = 'Chrome') => {
      switch (platformName) {
        case 'Chrome': {
          return 'https://chrome.google.com/webstore/detail/llfhpkkeljlgnjgkholeppfnepmjppob/reviews'
        }

        case 'Safari': {
          return 'https://apps.apple.com/us/app/zadark-zalo-dark-mode/1615941471?action=write-review'
        }

        case 'Edge': {
          return 'https://microsoftedge.microsoft.com/addons/detail/nbcljbcabjegmmogkcegephdkhckegcf'
        }

        case 'Firefox': {
          return 'https://addons.mozilla.org/en-US/firefox/addon/zadark/reviews'
        }

        default: {
          return '#'
        }
      }
    },

    initOSName: function () {
      const { parsedResult: { os } } = bowser.getParser(window.navigator.userAgent)
      this.setOSAttr(os.name)
    },

    initFontFamily: async function () {
      const { fontFamily } = await ZaDarkBrowser.getExtensionSettings()

      const isUseDefaultFont = !fontFamily

      const fonts = ['Open Sans:400;500;600']

      if (!isUseDefaultFont && fontFamily !== 'Open Sans') {
        fonts.push(`${fontFamily}:400;500;600`)
      }

      await this.installFontFamily(fonts, false)

      if (!isUseDefaultFont) {
        this.setFontFamilyAttr(fontFamily)
      }
    },

    initPageSettings: async function () {
      this.initOSName()
      this.initFontFamily()

      const {
        theme,
        fontSize,

        enabledHideLatestMessage,
        enabledHideConvAvatar,
        enabledHideConvName,
        enabledHideThreadChatMessage,

        useHotkeys
      } = await ZaDarkBrowser.getExtensionSettings()

      this.setPageTheme(theme)
      this.setFontSizeAttr(fontSize)

      this.setHideLatestMessageAttr(enabledHideLatestMessage)
      this.setHideConvAvatarAttr(enabledHideConvAvatar)
      this.setHideConvNameAttr(enabledHideConvName)
      this.setHideThreadChatMessageAttr(enabledHideThreadChatMessage)

      this.setUseHotkeysAttr(useHotkeys)
    },

    installFontFamily: async (fontFamilies = [], classes = true) => {
      if (!fontFamilies.length) {
        return false
      }

      try {
        await ZaDarkFonts.loadGoogleFonts(fontFamilies, classes)
        return true
      } catch (error) {
        return false
      }
    },

    initTippy: () => {
      tippy('[data-tippy-content]', {
        theme: 'zadark',
        allowHTML: true
      })

      tippy('#div_Main_TabZaDark', {
        theme: 'zadark',
        allowHTML: true,
        content: `Cài đặt ZaDark ${ZaDarkBrowser.getManifest().version}`,
        placement: 'right'
      })

      tippy('#js-input-font-family', {
        theme: 'zadark',
        allowHTML: true,
        content: '<p>Nhập tên phông chữ từ <strong>Google Fonts</strong><br>(Lưu ý kí tự in hoa, khoảng cách).</p><p>Bỏ trống nếu dùng phông mặc định.</p><p>Nhấn <strong>Enter</strong> để áp dụng.</p>',
        trigger: 'focus'
      })

      tippy('#js-select-translate-target', {
        theme: 'zadark',
        allowHTML: true,
        content: 'Bạn muốn dịch sang ngôn ngữ nào?'
      })
    },

    updateTheme: async function (theme) {
      await ZaDarkBrowser.saveExtensionSettings({ theme })
      this.setPageTheme(theme)
    },

    updateFontFamily: async function (fontFamily) {
      if (!fontFamily) {
        // Use default font
        await ZaDarkBrowser.saveExtensionSettings({ fontFamily })
        this.setFontFamilyAttr('')
        this.showToast('Đã thay đổi phông chữ')
        return true
      }

      const toast = this.showToast('Đang tải phông chữ...', { duration: -1 })

      const success = await this.installFontFamily([`${fontFamily}:400;500;600`], false)

      toast.hideToast()

      if (!success) {
        this.showToast('Không thể tải phông chữ')
        return false
      }

      await ZaDarkBrowser.saveExtensionSettings({ fontFamily })

      this.setFontFamilyAttr(fontFamily)
      this.showToast('Đã thay đổi phông chữ')

      return true
    },

    updateFontSize: async function (fontSize) {
      await ZaDarkBrowser.saveExtensionSettings({ fontSize })
      this.setFontSizeAttr(fontSize)
      ZaDarkUtils.showToast(this.HOTKEYS_TOAST_MESSAGE.fontSize(fontSize))
    },

    updateTranslateTarget: function (translateTarget) {
      return ZaDarkBrowser.saveExtensionSettings({ translateTarget })
    },

    getThreadChatBgSettingKey: function () {
      const convId = this.getCurrentConvId()
      if (!convId) return null
      return `threadChatBg_${convId}`
    },

    updateThreadChatBg: async function (imageBase64) {
      const settingKey = this.getThreadChatBgSettingKey()
      if (!settingKey) {
        throw new Error('Bạn cần chọn một cuộc trò chuyện')
      }

      if (imageBase64) {
        await ZaDarkBrowser.saveExtensionSettingsLocal({ [settingKey]: imageBase64 })
      } else {
        await ZaDarkBrowser.removeExtensionSettingsLocal([settingKey])
      }

      this.refreshThreadChatBg(imageBase64)
      this.showToast(imageBase64 ? 'Đã thay đổi hình nền' : 'Đã xóa hình nền')
    },

    updateHideLatestMessage: async function (enabledHideLatestMessage) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideLatestMessage })
      this.toggleBodyClassName('zadark-prv--latest-message', enabledHideLatestMessage)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideLatestMessage[enabledHideLatestMessage])
    },

    updateHideConvAvatar: async function (enabledHideConvAvatar) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideConvAvatar })
      this.toggleBodyClassName('zadark-prv--conv-avatar', enabledHideConvAvatar)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideConvAvatar[enabledHideConvAvatar])
    },

    updateHideConvName: async function (enabledHideConvName) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideConvName })
      this.toggleBodyClassName('zadark-prv--conv-name', enabledHideConvName)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideConvName[enabledHideConvName])
    },

    updateHideThreadChatMessage: async function (enabledHideThreadChatMessage) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideThreadChatMessage })
      this.toggleBodyClassName('zadark-prv--thread-chat-message', enabledHideThreadChatMessage)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideThreadChatMessage[enabledHideThreadChatMessage])
    },

    updateUseHotkeys: async function (useHotkeys) {
      await ZaDarkBrowser.saveExtensionSettings({ useHotkeys })
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.useHotkeys[useHotkeys])
      this.setUseHotkeysAttr(useHotkeys)
    },

    showIntroHideThreadChatMessage: function ({ onExit, onComplete } = {}) {
      this.showIntro({
        steps: [
          {
            element: document.querySelector('#messageView'),
            intro: 'Bạn di chuột vào vùng này để <strong>xem nội dung tin nhắn</strong>'
          },
          {
            element: document.querySelector('#chatInput'),
            intro: 'Bạn di chuyển chuột vào vùng này để <strong>xem nội dung khung soạn tin nhắn</strong>'
          },
          {
            element: document.querySelector('.chat-box-bar'),
            intro: 'Bạn di chuyển chuột vào vùng này để: <strong>Ẩn nội dung tin nhắn</strong> (bên trên), <strong>Ẩn nội dung khung soạn tin nhắn</strong> (bên dưới)'
          }
        ],
        onExit,
        onComplete
      })
    },

    refreshThreadChatBg: (imageBase64 = '') => {
      const convId = ZaDarkUtils.getCurrentConvId()
      const styleTagId = ZaDarkUtils.getThreadChatBgSettingKey()

      let styleElement = document.getElementById(styleTagId)

      if (!imageBase64) {
        if (!styleElement) return

        // Remove style tag
        styleElement.remove()

        // Revoke blob URL to free up memory
        const blobURL = styleElement.getAttribute('data-blob-url')
        URL.revokeObjectURL(blobURL)

        return
      }

      const blob = ZaDarkShared.convertBase64ToBlob(imageBase64)
      const blobURL = URL.createObjectURL(blob)
      const cssRule = `body[data-current-conv-id="${convId}"] { --zadark-thread-chat-bg-url: url('${blobURL}'); }`

      if (styleElement) {
        // Update existing style tag
        styleElement.innerHTML = cssRule
        return
      }

      // Create new style tag
      styleElement = document.createElement('style')
      styleElement.type = 'text/css'
      styleElement.id = styleTagId
      styleElement.setAttribute('data-blob-url', blobURL)
      styleElement.appendChild(document.createTextNode(cssRule))
      document.head.appendChild(styleElement)
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
    ZaDarkBrowser.getExtensionSettings().then(({ theme }) => {
      if (theme === 'auto') {
        ZaDarkUtils.setThemeAttr(event.matches ? 'dark' : 'light')
      }
    })
  })

  global.ZaDarkUtils = ZaDarkUtils
})(this)
