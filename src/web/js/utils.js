/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric

  ! This file must use VanillaJS
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.utils = {
    setThemeAttr: (themeMode) => {
      document.documentElement.setAttribute('data-zadark-theme', themeMode)
    },

    setFontAttr: (font) => {
      document.documentElement.setAttribute('data-zadark-font', font)
    },

    setFontSizeAttr: (fontSize) => {
      document.documentElement.setAttribute('data-zadark-font-size', fontSize)
    },

    setOSAttr: (os) => {
      document.documentElement.setAttribute('data-zadark-os', os)
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

    refreshPageTheme: function () {
      window.zadark.browser.getExtensionSettings().then(({ theme }) => {
        this.setPageTheme(theme)
      })
    },

    refreshPageSettings: function () {
      window.zadark.browser.getExtensionSettings().then(({
        theme,
        font,
        fontSize,
        enabledHideLatestMessage,
        enabledHideConvAvatarName,
        enabledHideThreadChatMessage
      }) => {
        this.setPageTheme(theme)
        this.setFontAttr(font)
        this.setFontSizeAttr(fontSize)

        this.toggleBodyClassName('zadark-prv--latest-message', enabledHideLatestMessage)
        this.toggleBodyClassName('zadark-prv--conv-avatar-name', enabledHideConvAvatarName)
        this.toggleBodyClassName('zadark-prv--thread-chat-message', enabledHideThreadChatMessage)
      })
    },

    isSupportDeclarativeNetRequest: () => {
      const { parsedResult: { browser, os } } = bowser.getParser(window.navigator.userAgent)
      console.log(os)

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
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
    window.zadark.browser.getExtensionSettings().then(({ theme }) => {
      if (theme === 'auto') {
        window.zadark.utils.setThemeAttr(event.matches ? 'dark' : 'light')
      }
    })
  })
})(window)
