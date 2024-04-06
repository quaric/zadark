/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

(function () {
  if (typeof require === 'function') {
    window.$ = require('./zadark-jquery.min.js')
    window.hotkeys = require('./zadark-hotkeys-js.min.js')
    window.Toastify = require('./zadark-toastify.min.js')
    window.WebFont = require('./zadark-webfont.min.js')
    window.introJs = require('./zadark-introjs.min.js')
  }

  const ZADARK_THEME_KEY = '@ZaDark:THEME'
  const ZADARK_FONT_FAMILY_KEY = '@ZaDark:FONT_FAMILY'
  const ZADARK_FONT_SIZE_KEY = '@ZaDark:FONT_SIZE'
  const ZADARK_TRANSLATE_TARGET_KEY = '@ZaDark:TRANSLATE_TARGET'

  const ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_LATEST_MESSAGE'
  const ZADARK_ENABLED_HIDE_CONV_AVATAR_KEY = '@ZaDark:ENABLED_HIDE_CONV_AVATAR'
  const ZADARK_ENABLED_HIDE_CONV_NAME_KEY = '@ZaDark:ENABLED_HIDE_CONV_NAME'
  const ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_THREAD_CHAT_MESSAGE'

  const ZADARK_ENABLED_BLOCK_TYPING_KEY = '@ZaDark:ENABLED_BLOCK_TYPING'
  const ZADARK_ENABLED_BLOCK_DELIVERED_KEY = '@ZaDark:ENABLED_BLOCK_DELIVERED'
  const ZADARK_ENABLED_BLOCK_SEEN_KEY = '@ZaDark:ENABLED_BLOCK_SEEN'
  const BLOCK_STORAGE_KEYS = {
    block_typing: ZADARK_ENABLED_BLOCK_TYPING_KEY,
    block_delivered: ZADARK_ENABLED_BLOCK_DELIVERED_KEY,
    block_seen: ZADARK_ENABLED_BLOCK_SEEN_KEY
  }
  const BLOCK_IDS = ['block_typing', 'block_delivered', 'block_seen', 'block_online']

  const ZADARK_USE_HOTKEYS = '@ZaDark:USE_HOTKEYS'
  const ZADARK_KNOWN_VERSION_KEY = '@ZaDark:KNOWN_VERSION'
  const ZALO_APP_VERSION_KEY = 'sh_app_ver'

  const ZADARK_MIGRATION_KEY = '@ZaDark:MIGRATION'
  const ZADARK_MIGRATION_VALUE = 'S2zhgZnVijSf9MSi'

  const HOTKEYS_TOAST_MESSAGE = {
    fontSize: {
      small: 'Đã áp dụng cỡ chữ 90%',
      medium: 'Đã áp dụng cỡ chữ 100%',
      big: 'Đã áp dụng cỡ chữ 110%',
      'very-big': 'Đã áp dụng cỡ chữ 125%'
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
    block_typing: {
      true: 'Đã bật Ẩn trạng thái Đang soạn tin',
      false: 'Đã tắt Ẩn trạng thái Đang soạn tin'
    },
    block_delivered: {
      true: 'Đã bật Ẩn trạng thái Đã nhận',
      false: 'Đã tắt Ẩn trạng thái Đã nhận'
    },
    block_seen: {
      true: 'Đã bật Ẩn trạng thái Đã xem',
      false: 'Đã tắt Ẩn trạng thái Đã xem'
    },
    useHotkeys: {
      true: 'Đã kích hoạt phím tắt',
      false: 'Đã vô hiệu hoá phím tắt'
    }
  }

  const COMMON_TOAST_MESSAGE = {
    needToRestart: 'Bạn vui lòng tắt & mở lại Zalo PC để áp dụng thay đổi'
  }

  const ZaDarkCookie = {
    isSupport: () => {
      if (window.$zelectron && typeof window.$zelectron.setCookie === 'function') {
        return true
      }

      if (window.electronAPI && typeof window.electronAPI.setCustomCookie === 'function') {
        return true
      }

      return false
    },

    set: async (name, value) => {
      try {
        const url = 'https://zadark.com/'
        const domain = 'zadark.com'

        if (window.$zelectron && typeof window.$zelectron.setCookie === 'function') {
          await window.$zelectron.setCookie(name, value, url, domain)
          return true
        }

        if (window.electronAPI && typeof window.electronAPI.setCustomCookie === 'function') {
          await window.electronAPI.setCustomCookie(url, domain, {
            name,
            value,
            expirationDate: Date.now() + 31536e6 // 1 year
          })
          return true
        }

        return false
      } catch (error) {
        return false
      }

      // Refs:
      // Zalo <= 23.6.1
      // window.electronAPI.setCustomCookie('https://zadark.com', 'zadark.com', { name: "@ZaDark:THEME", value: "dark", expirationDate: Date.now() + 31536e6 })
      //
      // Zalo >= 23.7.1
      // window.$zelectron.setCookie('@ZaDark:THEME', 'dark', 'https://zadark.com', 'zadark.com')
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

    saveTranslateTarget: (translateTarget) => {
      return localStorage.setItem(ZADARK_TRANSLATE_TARGET_KEY, translateTarget)
    },
    getTranslateTarget: () => {
      return localStorage.getItem(ZADARK_TRANSLATE_TARGET_KEY) || 'vi'
    },

    saveEnabledHideLatestMessage: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY, isEnabled)
    },
    getEnabledHideLatestMessage: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY) === 'true'
    },

    saveEnabledHideConvAvatar: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_CONV_AVATAR_KEY, isEnabled)
    },
    getEnabledHideConvAvatar: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_CONV_AVATAR_KEY) === 'true'
    },

    saveEnabledHideConvName: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_CONV_NAME_KEY, isEnabled)
    },
    getEnabledHideConvName: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_CONV_NAME_KEY) === 'true'
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
        ZaDarkCookie.set(key, isEnabled ? 'true' : 'false')
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

    saveUseHotkeys: (useHotkeys) => {
      return localStorage.setItem(ZADARK_USE_HOTKEYS, useHotkeys)
    },
    getUseHotkeys: () => {
      const value = localStorage.getItem(ZADARK_USE_HOTKEYS) || 'true'
      return value === 'true'
    },

    getKnownVersion: () => {
      return localStorage.getItem(ZADARK_KNOWN_VERSION_KEY) || '0.0'
    },
    saveKnownVersion: (version) => {
      return localStorage.setItem(ZADARK_KNOWN_VERSION_KEY, version)
    },

    getZaloAppVersion: () => {
      return localStorage.getItem(ZALO_APP_VERSION_KEY) || '0.0'
    },

    isMigrationNeeded: () => {
      return localStorage.getItem(ZADARK_MIGRATION_KEY) !== ZADARK_MIGRATION_VALUE
    },
    setMigrationDone: () => {
      return localStorage.setItem(ZADARK_MIGRATION_KEY, ZADARK_MIGRATION_VALUE)
    }
  }

  const ZaDarkUtils = {
    getZaDarkVersion: () => {
      return $('html').data('zadark-version')
    },

    toggleBodyClassName: (className, isEnabled) => {
      if (isEnabled) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
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

      if (!fontFamily) {
        this.installFontFamily(['Open Sans:400,500,600:latin,vietnamese'], false)
        return
      }

      await this.installFontFamily([`${fontFamily}:400,500,600:latin,vietnamese`, 'Open Sans:400,500,600:latin,vietnamese'], false)
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

      const enabledHideConvAvatar = ZaDarkStorage.getEnabledHideConvAvatar()
      this.setHideConvAvatarAttr(enabledHideConvAvatar)

      const enabledHideConvName = ZaDarkStorage.getEnabledHideConvName()
      this.setHideConvNameAttr(enabledHideConvName)

      const enabledHideThreadChatMessage = ZaDarkStorage.getEnabledHideThreadChatMessage()
      this.setHideThreadChatMessageAttr(enabledHideThreadChatMessage)

      const useHotkeys = ZaDarkStorage.getUseHotkeys()
      this.setUseHotkeysAttr(useHotkeys)
    },

    updateTheme: function (theme) {
      ZaDarkStorage.saveTheme(theme)
      this.setPageTheme(theme)
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
        this.showToast('Không thể tải phông chữ.')
        return false
      }

      ZaDarkStorage.saveFontFamily(fontFamily)

      this.setFontFamilyAttr(fontFamily)
      this.showToast('Đã thay đổi phông chữ.')

      return true
    },

    updateFontSize: function (fontSize) {
      ZaDarkStorage.saveFontSize(fontSize)
      this.setFontSizeAttr(fontSize)
      ZaDarkUtils.showToast(HOTKEYS_TOAST_MESSAGE.fontSize[fontSize])
    },

    updateTranslateTarget: function (translateTarget) {
      ZaDarkStorage.saveTranslateTarget(translateTarget)
    },

    updateHideLatestMessage: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideLatestMessage(isEnabled)
      this.toggleBodyClassName('zadark-prv--latest-message', isEnabled)
      this.showToast(HOTKEYS_TOAST_MESSAGE.hideLatestMessage[isEnabled])
    },

    updateHideConvAvatar: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideConvAvatar(isEnabled)
      this.toggleBodyClassName('zadark-prv--conv-avatar', isEnabled)
      this.showToast(HOTKEYS_TOAST_MESSAGE.hideConvAvatar[isEnabled])
    },

    updateHideConvName: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideConvName(isEnabled)
      this.toggleBodyClassName('zadark-prv--conv-name', isEnabled)
      this.showToast(HOTKEYS_TOAST_MESSAGE.hideConvName[isEnabled])
    },

    updateHideThreadChatMessage: function (isEnabled) {
      ZaDarkStorage.saveEnabledHideThreadChatMessage(isEnabled)
      this.toggleBodyClassName('zadark-prv--thread-chat-message', isEnabled)
      this.showToast(HOTKEYS_TOAST_MESSAGE.hideThreadChatMessage[isEnabled])
    },

    updateBlockSettings: function (blockId, isEnabled) {
      ZaDarkStorage.saveBlockSettings(blockId, isEnabled)
      this.showToast(HOTKEYS_TOAST_MESSAGE[blockId][isEnabled])
      this.showToast(COMMON_TOAST_MESSAGE.needToRestart, {
        className: 'toastify--warning',
        duration: 10000
      })
    },

    updateUseHotkeys: function (useHotkeys) {
      ZaDarkStorage.saveUseHotkeys(useHotkeys)
      this.showToast(HOTKEYS_TOAST_MESSAGE.useHotkeys[useHotkeys])
      this.setUseHotkeysAttr(useHotkeys)
    },

    updateKnownVersionState: (buttonEl) => {
      const zadarkVersion = $('html').data('zadark-version')
      ZaDarkStorage.saveKnownVersion(zadarkVersion)
      buttonEl.classList.remove('zadark-known-version')
    },

    showIntroHideThreadChatMessage: function ({ onExit, onComplete } = {}) {
      this.showIntro({
        steps: [
          {
            element: document.querySelector('#messageView'),
            intro: 'Bạn di chuột vào vùng này để <strong>xem nội dung tin nhắn</strong>.'
          },
          {
            element: document.querySelector('.chat-input__content__input'),
            intro: 'Bạn di chuyển chuột vào vùng này để <strong>xem nội dung khung soạn tin nhắn</strong>.'
          },
          {
            element: document.querySelector('#ztoolbar'),
            intro: 'Bạn di chuyển chuột vào vùng này để: <strong>Ẩn nội dung tin nhắn</strong> (bên trên), <strong>Ẩn nội dung khung soạn tin nhắn</strong> (bên dưới).'
          }
        ],
        onExit,
        onComplete
      })
    },

    debounce: (func, delay) => {
      let timer
      return () => {
        clearTimeout(timer)
        timer = setTimeout(func, delay)
      }
    },

    migrateData: async function () {
      const isMigrationNeeded = ZaDarkStorage.isMigrationNeeded()

      if (!isMigrationNeeded) {
        return
      }

      const blockSettings = ZaDarkStorage.getBlockSettings()
      await Promise.all([
        ZaDarkCookie.set(ZADARK_ENABLED_BLOCK_TYPING_KEY, blockSettings.block_typing),
        ZaDarkCookie.set(ZADARK_ENABLED_BLOCK_DELIVERED_KEY, blockSettings.block_delivered),
        ZaDarkCookie.set(ZADARK_ENABLED_BLOCK_SEEN_KEY, blockSettings.block_seen)
      ])

      // Flag migration is done
      ZaDarkStorage.setMigrationDone()

      this.showToast('ZaDark đã hoàn tất khởi tạo dữ liệu. Bạn vui lòng tắt & mở lại Zalo PC.', {
        className: 'toastify--warning',
        duration: 10000
      })
    }
  }

  ZaDarkUtils.initPageSettings()

  window.matchMedia('(prefers-color-scheme: dark)').addListener((event) => {
    const theme = ZaDarkStorage.getTheme()
    if (theme === 'auto') {
      ZaDarkUtils.setThemeAttr(event.matches ? 'dark' : 'light')
    }
  })

  const popupScrollableElName = '#js-zadark-popup__scrollable'
  const btnScrollElName = '#js-btn-scroll'

  const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]'
  const inputFontFamilyElName = '#js-input-font-family'
  const selectFontSizeElName = '#js-select-font-size'
  const selectTranslateTargetElName = '#js-select-translate-target'

  const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
  const switchHideConvAvatarElName = '#js-switch-hide-conv-avatar'
  const switchHideConvNameElName = '#js-switch-hide-conv-name'
  const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

  const switchBlockTypingElName = '#js-switch-block-typing'
  const switchBlockSeenElName = '#js-switch-block-seen'
  const switchBlockDeliveredElName = '#js-switch-block-delivered'

  const switchUseHotkeysElName = '#js-switch-use-hotkeys'

  const isSupportFeatureBlock = ZaDarkCookie.isSupport()

  const setRadioInputTheme = (theme) => {
    const options = ['light', 'dark', 'auto']
    options.forEach((option) => {
      $(radioInputThemeElName).filter(`[value="${option}"]`).prop('checked', option === theme)
    })
  }

  const handleNextTheme = () => {
    const theme = ZaDarkStorage.getTheme()

    const themes = ['light', 'dark']

    const nextIndex = themes.indexOf(theme) + 1
    const nextTheme = themes[nextIndex] || themes[0]

    setRadioInputTheme(nextTheme)
    ZaDarkUtils.updateTheme(nextTheme)
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

  const handleNextFontSize = (count) => {
    const fontSize = ZaDarkStorage.getFontSize()

    const fontSizes = ['small', 'medium', 'big', 'very-big']

    const nextIndex = count > 0
      ? Math.min(fontSizes.indexOf(fontSize) + 1, fontSizes.length - 1)
      : Math.max(fontSizes.indexOf(fontSize) - 1, 0)

    const nextFontSize = fontSizes[nextIndex]

    ZaDarkUtils.setSelect(selectFontSizeElName, nextFontSize)
    ZaDarkUtils.updateFontSize(nextFontSize)
  }

  const handleBlockSettingsChange = (blockId) => {
    return function (event) {
      if (!isSupportFeatureBlock) {
        ZaDarkUtils.setSwitch(this, false)
        ZaDarkUtils.showToast(`Vì Zalo nâng cấp mã nguồn, nên chức năng này tạm thời không khả dụng trên <strong>Zalo PC ${ZaDarkStorage.getZaloAppVersion()}</strong>.<br/>ZaDark sẽ cập nhật trong thời gian tới.`, {
          className: 'toastify--error'
        })
        return
      }

      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateBlockSettings(blockId, isEnabled)
    }
  }

  function disableFeatureBlock () {
    const disabledList = [switchBlockTypingElName, switchBlockSeenElName, switchBlockDeliveredElName]
    disabledList.forEach((elName) => {
      $(elName).parent().parent().addClass('zadark-switch--disabled')
    })

    tippy('.js-switch-block', {
      theme: 'zadark',
      allowHTML: true,
      content: `<p>Vì Zalo nâng cấp mã nguồn, nên chức năng này tạm thời không khả dụng trên <strong>Zalo PC ${ZaDarkStorage.getZaloAppVersion()}</strong>.</p><p>ZaDark sẽ cập nhật trong thời gian tới.</p>`
    })
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
        <img src="zadark-lockup.svg" alt="ZaDark" class="zadark-popup__header__logo-img" />
      </div>

      <div class="zadark-popup__header__menu-list">
        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="https://zadark.com/blog" title="Blog" target="_blank">Blog</a>
        </span>

        <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
          <a href="${ZaDarkUtils.getRatingURL()}" title="Đánh giá" target="_blank">Đánh giá</a>
        </span>

        <span class="zadark-popup__header__menu-item">
          <a href="https://zadark.canny.io" title="Góp ý" target="_blank">Góp ý</a>
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
                  &nbsp;<span class="zadark-hotkeys" data-keys-win="Ctrl+D" data-keys-mac="⌘D"></span>
                </span>
              </span>
            </label>

            <label class="zadark-radio">
              <input type="radio" name="theme" value="dark" class="zadark-radio__input">
              <span class="zadark-radio__checkmark"></span>
              <span class="zadark-radio__label">
                <span>Tối</span>
                <span class="zadark-switch__hotkeys">
                  &nbsp;<span class="zadark-hotkeys" data-keys-win="Ctrl+D" data-keys-mac="⌘D"></span>
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

          <div class="font-settings font-settings--border-default">
            <label class="font-settings__label">
              Phông chữ từ <a href="https://zadark.com/blog/use-google-fonts" target="_blank">Google Fonts</a>
            </label>

            <input id="js-input-font-family" class="zadark-input" placeholder="Mặc định">
          </div>

          <div class="font-settings font-settings--hotkeys">
            <label class="select-font__label">Cỡ chữ của tin nhắn</label>

            <span class="font-settings__hotkeys">
              <span class="zadark-hotkeys" data-keys-win="Ctrl+9 Ctrl+0" data-keys-mac="⌘9 ⌘0"></span>
            </span>

            <select id="js-select-font-size" class="zadark-select">
              <option value="small">90%</option>
              <option value="medium">100%</option>
              <option value="big">110%</option>
              <option value="very-big">125%</option>
            </select>
          </div>

          <div class="font-settings">
            <label class="font-settings__label" style="flex: 1;">
              Dịch tin nhắn
              <i class="zadark-icon zadark-icon--question" data-tippy-content='Bạn di chuyển chuột vào đoạn tin nhắn<br/>và chọn biểu tượng <i class="zadark-icon zadark-icon--translate" style="position: relative; top: 3px; font-size: 18px;"></i> để dịch tin nhắn.'></i>
              <span class="zadark-trial" data-tippy-content="Bạn có 10 lượt dịch tin nhắn mỗi ngày"></span>
            </label>

            <select id="js-select-translate-target" class="zadark-select"></select>
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
                <span class="zadark-hotkeys" data-keys-win="Ctrl+1" data-keys-mac="⌘1"></span>
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
                <span class="zadark-hotkeys" data-keys-win="Ctrl+2" data-keys-mac="⌘2"></span>
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
                <span class="zadark-hotkeys" data-keys-win="Ctrl+3" data-keys-mac="⌘3"></span>
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
                <span class="zadark-hotkeys" data-keys-win="Ctrl+7" data-keys-mac="⌘7"></span>
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
                <span class="zadark-hotkeys" data-keys-win="Ctrl+4" data-keys-mac="⌘4"></span>
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
                <span class="zadark-hotkeys" data-keys-win="Ctrl+5" data-keys-mac="⌘5"></span>
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
      <a href="https://quaric.com" target="_blank" title="ZaDark by Quaric" class="zadark-publisher">
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

    hotkeys(keys, function (event, handler) {
      event.preventDefault()

      const enabledHideLatestMessage = ZaDarkStorage.getEnabledHideLatestMessage()
      const enabledHideConvAvatar = ZaDarkStorage.getEnabledHideConvAvatar()
      const enabledHideConvName = ZaDarkStorage.getEnabledHideConvName()
      const enabledHideThreadChatMessage = ZaDarkStorage.getEnabledHideThreadChatMessage()
      const blockSettings = ZaDarkStorage.getBlockSettings()

      switch (handler.key) {
        // Hide latest message
        case 'command+1':
        case 'ctrl+1': {
          ZaDarkUtils.setSwitch(switchHideLatestMessageElName, !enabledHideLatestMessage)
          ZaDarkUtils.updateHideLatestMessage(!enabledHideLatestMessage)
          return
        }

        // Hide thread chat message
        case 'command+2':
        case 'ctrl+2': {
          ZaDarkUtils.setSwitch(switchHideThreadChatMessageElName, !enabledHideThreadChatMessage)
          ZaDarkUtils.updateHideThreadChatMessage(!enabledHideThreadChatMessage)
          return
        }

        // Hide conversation avatar
        case 'command+3':
        case 'ctrl+3': {
          ZaDarkUtils.setSwitch(switchHideConvAvatarElName, !enabledHideConvAvatar)
          ZaDarkUtils.updateHideConvAvatar(!enabledHideConvAvatar)
          return
        }

        // Hide conversation name
        case 'command+7':
        case 'ctrl+7': {
          ZaDarkUtils.setSwitch(switchHideConvNameElName, !enabledHideConvName)
          ZaDarkUtils.updateHideConvName(!enabledHideConvName)
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

        // Next theme
        case 'command+d':
        case 'ctrl+d': {
          handleNextTheme()
        }
      }
    })
  }

  const loadPopupState = () => {
    const theme = ZaDarkStorage.getTheme()
    setRadioInputTheme(theme)

    const fontFamily = ZaDarkStorage.getFontFamily()
    ZaDarkUtils.setSelect(inputFontFamilyElName, fontFamily)

    const fontSize = ZaDarkStorage.getFontSize()
    ZaDarkUtils.setSelect(selectFontSizeElName, fontSize)

    const enabledHideLatestMessage = ZaDarkStorage.getEnabledHideLatestMessage()
    ZaDarkUtils.setSwitch(switchHideLatestMessageElName, enabledHideLatestMessage)

    const enabledHideConvAvatar = ZaDarkStorage.getEnabledHideConvAvatar()
    ZaDarkUtils.setSwitch(switchHideConvAvatarElName, enabledHideConvAvatar)

    const enabledHideConvName = ZaDarkStorage.getEnabledHideConvName()
    ZaDarkUtils.setSwitch(switchHideConvNameElName, enabledHideConvName)

    const enabledHideThreadChatMessage = ZaDarkStorage.getEnabledHideThreadChatMessage()
    ZaDarkUtils.setSwitch(switchHideThreadChatMessageElName, enabledHideThreadChatMessage)

    if (isSupportFeatureBlock) {
      const blockSettings = ZaDarkStorage.getBlockSettings()
      ZaDarkUtils.setSwitch(switchBlockTypingElName, blockSettings.block_typing)
      ZaDarkUtils.setSwitch(switchBlockDeliveredElName, blockSettings.block_delivered)
      ZaDarkUtils.setSwitch(switchBlockSeenElName, blockSettings.block_seen)
    } else {
      disableFeatureBlock()
    }

    const useHotkeys = ZaDarkStorage.getUseHotkeys()
    ZaDarkUtils.setSwitch(switchUseHotkeysElName, useHotkeys)
  }

  const loadHotkeysState = async () => {
    const useHotkeys = ZaDarkStorage.getUseHotkeys()
    loadHotkeys(useHotkeys)
  }

  const loadKnownVersionState = (buttonEl) => {
    const knownVersion = ZaDarkStorage.getKnownVersion()
    const zadarkVersion = $('html').data('zadark-version')

    if (`${knownVersion}` !== `${zadarkVersion}`) {
      buttonEl.classList.add('zadark-known-version')
    }
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

    $(popupScrollableElName).on('scroll', ZaDarkUtils.debounce(calcPopupScroll, 150))
    $(window).on('resize', ZaDarkUtils.debounce(calcPopupScroll, 250))

    $(btnScrollElName).on('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
      $(popupScrollableElName).animate({ scrollTop: $(popupScrollableElName).height() }, 1000)
    })
  }

  const loadTranslate = () => {
    const translateTarget = ZaDarkStorage.getTranslateTarget()
    $(selectTranslateTargetElName).setLanguagesOptions(translateTarget)
    $(document).enableTranslateMessage(translateTarget)
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
      ZaDarkUtils.updateKnownVersionState(buttonEl)

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

  const loadTippy = () => {
    tippy('[data-tippy-content]', {
      theme: 'zadark',
      allowHTML: true
    })

    tippy('#div_Main_TabZaDark', {
      theme: 'zadark',
      allowHTML: true,
      content: `Cài đặt ZaDark ${ZaDarkUtils.getZaDarkVersion()}`,
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
  }

  const loadZaDarkPopup = () => {
    const [zaloTabsBottomEl] = document.querySelectorAll('.nav__tabs__bottom')

    if (!zaloTabsBottomEl) {
      return
    }

    zaloTabsBottomEl.insertAdjacentHTML('afterbegin', zadarkButtonHTML)

    const zaloAppBody = document.body
    zaloAppBody.insertAdjacentHTML('beforeend', zadarkPopupHTML)

    $(radioInputThemeElName).on('change', function () {
      const theme = $(this).val()
      ZaDarkUtils.updateTheme(theme)
    })

    $(inputFontFamilyElName).keypress(handleInputFontFamilyKeyPress)

    $(selectFontSizeElName).on('change', function () {
      const fontSize = $(this).val()
      ZaDarkUtils.updateFontSize(fontSize)
    })

    $(selectTranslateTargetElName).on('change', function () {
      const translateTarget = $(this).val()
      ZaDarkUtils.updateTranslateTarget(translateTarget)

      $(document).disableTranslateMessage()
      if (translateTarget !== 'none') {
        $(document).enableTranslateMessage(translateTarget)
      }
    })

    $(switchHideLatestMessageElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateHideLatestMessage(isEnabled)
    })

    $(switchHideConvAvatarElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateHideConvAvatar(isEnabled)
    })

    $(switchHideConvNameElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateHideConvName(isEnabled)
    })

    $(switchHideThreadChatMessageElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateHideThreadChatMessage(isEnabled)
    })

    $(switchBlockTypingElName).on('change', handleBlockSettingsChange('block_typing'))
    $(switchBlockSeenElName).on('change', handleBlockSettingsChange('block_seen'))
    $(switchBlockDeliveredElName).on('change', handleBlockSettingsChange('block_delivered'))

    $(switchUseHotkeysElName).on('change', function () {
      const isEnabled = $(this).is(':checked')
      ZaDarkUtils.updateUseHotkeys(isEnabled)
      loadHotkeys(isEnabled)
    })

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
    loadTippy()

    ZaDarkUtils.migrateData()

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
