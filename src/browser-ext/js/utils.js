/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

;(function (window) {
  window.zadark = window.zadark || {}

  window.zadark.utils = {
    setThemeModeAttribute: (themeMode) => {
      document.documentElement.setAttribute('data-theme-mode', themeMode)
    },

    setDarkThemeAttribute: (themeMode) => {
      document.documentElement.setAttribute('data-dark-theme', themeMode)
    },

    setLightThemeAttribute: (themeMode) => {
      document.documentElement.setAttribute('data-light-theme', themeMode)
    },

    setPageTheme: function ({ themeMode, userTheme, darkTheme }) {
      if (themeMode === 'single') {
        if (['dark', 'dark_dimmed'].includes(userTheme)) {
          this.setThemeModeAttribute('dark')
          this.setDarkThemeAttribute(userTheme)
        } else {
          this.setThemeModeAttribute('light')
          this.setLightThemeAttribute(userTheme)
        }
      }

      if (themeMode === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setThemeModeAttribute(isDark ? 'dark' : 'light')
        this.setDarkThemeAttribute(darkTheme)
      }
    },

    refreshPageTheme: function () {
      window.zadark.browser.getExtensionSettings().then(({ themeMode, userTheme, darkTheme }) => {
        this.setPageTheme({
          themeMode,
          userTheme,
          darkTheme
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
