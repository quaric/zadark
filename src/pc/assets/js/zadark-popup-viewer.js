/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

(function () {
  const ZADARK_THEME_KEY = '@ZaDark:THEME'

  const getTheme = () => {
    return localStorage.getItem(ZADARK_THEME_KEY) || 'dark'
  }

  const setThemeAttr = (themeMode) => {
    document.documentElement.setAttribute('data-zadark-theme', themeMode)
  }

  const setPageTheme = (theme) => {
    switch (theme) {
      case 'light':
      case 'dark': {
        setThemeAttr(theme)
        return
      }

      case 'auto': {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setThemeAttr(isDark ? 'dark' : 'light')
        return
      }

      default: {
        setThemeAttr('dark')
      }
    }
  }

  // Initialize theme
  setPageTheme(getTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addListener((event) => {
    if (getTheme() === 'auto') {
      setThemeAttr(event.matches ? 'dark' : 'light')
    }
  })
})()
