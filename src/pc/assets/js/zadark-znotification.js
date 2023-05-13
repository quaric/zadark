/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

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

  setHideThreadChatMessage: function (isEnabled) {
    if (isEnabled) {
      document.body.classList.add('zadark-prv--thread-chat-message')
    } else {
      document.body.classList.remove('zadark-prv--thread-chat-message')
    }
  },

  handleContentChange: async function () {
    if (DEBUG) console.log('contentChanged')
    const { theme, hideThreadChatMessage } = await ipcRenderer.invoke('@ZaDark:GET_SETTINGS')
    this.setPageTheme(theme)
    this.setHideThreadChatMessage(hideThreadChatMessage)
  },

  initMutationObserver: function () {
    const observer = new MutationObserver((mutationsList) => {
      const contentChanged = mutationsList.some((mutation) => mutation.type === 'childList' && mutation.addedNodes.length > 0)
      if (contentChanged) {
        this.handleContentChange()
      }
    })

    observer.observe(document.getElementById('zbg'), {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
}

window.zadark.utils.initMutationObserver()
