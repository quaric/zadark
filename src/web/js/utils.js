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

    refreshPageTheme: function () {
      window.zadark.browser.getExtensionSettings().then(({ theme }) => {
        this.setPageTheme(theme)
      })
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
