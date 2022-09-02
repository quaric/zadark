/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by NCDAi Studio

  ! This file must use VanillaJS
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.utils = {
    setThemeModeAttribute: (themeMode) => {
      document.documentElement.setAttribute('data-theme-mode', themeMode)
    },

    setPageTheme: function ({ themeMode, customTheme }) {
      if (['custom', 'single'].includes(themeMode)) {
        this.setThemeModeAttribute(customTheme)
      }

      if (themeMode === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setThemeModeAttribute(isDark ? 'dark' : 'light')
      }
    },

    refreshPageTheme: function () {
      window.zadark.browser.getExtensionSettings().then(({ themeMode, customTheme }) => {
        this.setPageTheme({
          themeMode,
          customTheme
        })
      })
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
    window.zadark.browser.getExtensionSettings().then(({ themeMode }) => {
      if (themeMode === 'auto') {
        window.zadark.utils.setThemeModeAttribute(event.matches ? 'dark' : 'light')
      }
    })
  })
})(window)
