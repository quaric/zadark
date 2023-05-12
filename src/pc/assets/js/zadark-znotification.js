const { ipcRenderer } = require('electron')

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

  initTheme: function () {
    let count = 0

    const interval = setInterval(() => {
      ipcRenderer.invoke('@ZaDark:GET_THEME').then((theme) => {
        if (DEBUG) console.log('initTheme -> success', theme)

        if (theme !== null) {
          clearInterval(interval)
          this.setPageTheme(theme)
          return
        }

        ++count
        if (count >= 10) {
          clearInterval(interval)
        }
      }).catch((error) => {
        if (DEBUG) console.error('initTheme -> error', error)
        clearInterval(interval)
      })
    }, 1000)
  },

  refreshTheme: async function () {
    if (DEBUG) console.log('contentChanged')
    const theme = await ipcRenderer.invoke('@ZaDark:GET_THEME')
    this.setPageTheme(theme)
  },

  initMutationObserver: function () {
    const observer = new MutationObserver((mutationsList) => {
      const contentChanged = mutationsList.some((mutation) => mutation.type === 'childList' && mutation.addedNodes.length > 0)
      if (contentChanged) {
        this.refreshTheme()
      }
    })

    observer.observe(document.getElementById('zbg'), {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
}

window.zadark.utils.initTheme()
window.zadark.utils.initMutationObserver()
