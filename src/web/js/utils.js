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

      CHANGE_HIDE_LATEST_MESSAGE: '@ZaDark:CHANGE_HIDE_LATEST_MESSAGE',
      CHANGE_HIDE_CONV_AVATAR_NAME: '@ZaDark:CHANGE_HIDE_CONV_AVATAR_NAME',
      CHANGE_HIDE_THREAD_CHAT_MESSAGE: '@ZaDark:CHANGE_HIDE_THREAD_CHAT_MESSAGE',

      GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
      UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS',

      REFRESH_ZALO_TABS: '@ZaDark:REFRESH_ZALO_TABS'
    },

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

    toggleBodyClassName: (className, isEnabled) => {
      if (isEnabled) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
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

    isSupportDeclarativeNetRequest: () => {
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

        case 'Edge': {
          return 'https://microsoftedge.microsoft.com/addons/detail/nbcljbcabjegmmogkcegephdkhckegcf'
        }

        case 'Opera': {
          return 'https://addons.opera.com/en/extensions/details/zadark-best-dark-theme-for-zalo'
        }

        case 'Firefox': {
          return 'https://addons.mozilla.org/en-US/firefox/addon/zadark/reviews'
        }

        default: {
          return 'https://chrome.google.com/webstore/detail/llfhpkkeljlgnjgkholeppfnepmjppob/reviews'
        }
      }
    },

    initOSName: function () {
      const { parsedResult: { os } } = bowser.getParser(window.navigator.userAgent)
      this.setOSAttr(os.name)
    },

    initFontFamily: async function () {
      const { fontFamily } = await ZaDarkBrowser.getExtensionSettings()

      if (!fontFamily) {
        this.installFontFamily(['Open Sans:400,600:latin,vietnamese'], false)
        return
      }

      await this.installFontFamily(['Open Sans:400,600:latin,vietnamese', `${fontFamily}:400,500:latin,vietnamese`], false)
      this.setFontFamilyAttr(fontFamily)
    },

    initPageSettings: async function () {
      this.initOSName()
      this.initFontFamily()

      const {
        theme,
        fontSize,

        enabledHideLatestMessage,
        enabledHideConvAvatarName,
        enabledHideThreadChatMessage
      } = await ZaDarkBrowser.getExtensionSettings()

      this.setPageTheme(theme)
      this.setFontSizeAttr(fontSize)

      this.setHideLatestMessageAttr(enabledHideLatestMessage)
      this.setHideConvAvatarNameAttr(enabledHideConvAvatarName)
      this.setHideThreadChatMessageAttr(enabledHideThreadChatMessage)
    },

    installFontFamily: (fontFamilies = [], classes = true) => {
      if (!fontFamilies.length) {
        return Promise.resolve(false)
      }

      return new Promise((resolve) => {
        WebFont.load({
          google: {
            families: fontFamilies
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

    initTippy: () => {
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

      const success = await this.installFontFamily([`${fontFamily}:400,500:latin,vietnamese`], false)

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
      ZaDarkUtils.showToast(ZaDarkUtils.HOTKEYS_TOAST_MESSAGE.fontSize[fontSize])
    },

    updateHideLatestMessage: async function (enabledHideLatestMessage) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideLatestMessage })
      this.toggleBodyClassName('zadark-prv--latest-message', enabledHideLatestMessage)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideLatestMessage[enabledHideLatestMessage])
    },

    updateHideConvAvatarName: async function (enabledHideConvAvatarName) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideConvAvatarName })
      this.toggleBodyClassName('zadark-prv--conv-avatar-name', enabledHideConvAvatarName)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.HideConvAvatarName[enabledHideConvAvatarName])
    },

    updateHideThreadChatMessage: async function (enabledHideThreadChatMessage) {
      await ZaDarkBrowser.saveExtensionSettings({ enabledHideThreadChatMessage })
      this.toggleBodyClassName('zadark-prv--thread-chat-message', enabledHideThreadChatMessage)
      this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideThreadChatMessage[enabledHideThreadChatMessage])
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
