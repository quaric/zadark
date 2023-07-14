/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

(function () {
  const { ipcRenderer } = require('electron')

  const ZaDarkUtils = {
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

    toggleBodyClassName: (className, isEnabled) => {
      if (isEnabled) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
      }
    },

    handleContentChange: async function () {
      if (DEBUG) console.log('contentChanged')

      const { theme, hideLatestMessage, hideConvAvatar, hideConvName } = await ipcRenderer.invoke('@ZaDark:GET_SETTINGS')

      this.setPageTheme(theme)
      this.toggleBodyClassName('zadark-prv--latest-message', hideLatestMessage)
      this.toggleBodyClassName('zadark-prv--conv-avatar', hideConvAvatar)
      this.toggleBodyClassName('zadark-prv--conv-name', hideConvName)
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

  ZaDarkUtils.initMutationObserver()
})()
