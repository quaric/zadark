/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

// eslint-disable-next-line no-global-assign
const $ = jQuery = module.exports // Ref: https://github.com/electron/electron/issues/345#issuecomment-43894441
const { ipcRenderer } = require('electron')

const ZADARK_THEME_KEY = '@ZaDark:THEME'
const ZADARK_FONT_KEY = '@ZaDark:FONT'
const ZADARK_FONT_SIZE_KEY = '@ZaDark:FONT_SIZE'

const ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_LATEST_MESSAGE'
const ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_THREAD_CHAT_MESSAGE'

const ZADARK_ENABLED_BLOCK_TYPING_KEY = '@ZaDark:ENABLED_BLOCK_TYPING'
const ZADARK_ENABLED_BLOCK_DELIVERED_KEY = '@ZaDark:ENABLED_BLOCK_DELIVERED'
const ZADARK_ENABLED_BLOCK_SEEN_KEY = '@ZaDark:ENABLED_BLOCK_SEEN'
const ZADARK_ENABLED_BLOCK_ONLINE_KEY = '@ZaDark:ENABLED_BLOCK_ONLINE'

const ZADARK_KNOWN_VERSION_KEY = '@ZaDark:KNOWN_VERSION'

const BLOCK_IDS = ['block_typing', 'block_delivered', 'block_seen', 'block_online']
const BLOCK_STORAGE_KEYS = {
  block_typing: ZADARK_ENABLED_BLOCK_TYPING_KEY,
  block_delivered: ZADARK_ENABLED_BLOCK_DELIVERED_KEY,
  block_seen: ZADARK_ENABLED_BLOCK_SEEN_KEY,
  block_online: ZADARK_ENABLED_BLOCK_ONLINE_KEY
}

window.zadark = window.zadark || {}

window.zadark.storage = {
  getTheme: () => {
    return localStorage.getItem(ZADARK_THEME_KEY) || 'dark'
  },

  saveTheme: (theme) => {
    return localStorage.setItem(ZADARK_THEME_KEY, theme)
  },

  getFont: () => {
    return localStorage.getItem(ZADARK_FONT_KEY) || 'open-sans'
  },

  saveFont: (font) => {
    return localStorage.setItem(ZADARK_FONT_KEY, font)
  },

  getFontSize: () => {
    return localStorage.getItem(ZADARK_FONT_SIZE_KEY) || 'medium'
  },

  saveFontSize: (fontSize) => {
    return localStorage.setItem(ZADARK_FONT_SIZE_KEY, fontSize)
  },

  saveEnabledHideLatestMessage: (isEnabled) => {
    return localStorage.setItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY, isEnabled)
  },

  getEnabledHideLatestMessage: () => {
    return localStorage.getItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY) === 'true'
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
      return localStorage.setItem(key, isEnabled)
    }
  },

  getBlockSettings: () => {
    return {
      block_typing: localStorage.getItem(ZADARK_ENABLED_BLOCK_TYPING_KEY) === 'true',
      block_delivered: localStorage.getItem(ZADARK_ENABLED_BLOCK_DELIVERED_KEY) === 'true',
      block_seen: localStorage.getItem(ZADARK_ENABLED_BLOCK_SEEN_KEY) === 'true',
      block_online: localStorage.getItem(ZADARK_ENABLED_BLOCK_ONLINE_KEY) === 'true'
    }
  },

  getKnownVersion: () => {
    return localStorage.getItem(ZADARK_KNOWN_VERSION_KEY) || '0.0'
  },

  saveKnownVersion: (version) => {
    return localStorage.setItem(ZADARK_KNOWN_VERSION_KEY, version)
  }
}

window.zadark.utils = {
  isMac: () => {
    return document.documentElement.getAttribute('data-zadark-platform') === 'darwin'
  },

  setThemeAttr: (themeMode) => {
    document.documentElement.setAttribute('data-zadark-theme', themeMode)
  },

  setFontAttr: (font) => {
    document.documentElement.setAttribute('data-zadark-font', font)
  },

  setFontSizeAttr: (fontSize) => {
    document.documentElement.setAttribute('data-zadark-font-size', fontSize)
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
    const theme = window.zadark.storage.getTheme()
    this.setPageTheme(theme)

    if (!this.isMac()) {
      ipcRenderer.send('@ZaDark:UPDATE_SETTINGS', { theme })
    }
  },

  refreshPageFont: function () {
    const font = window.zadark.storage.getFont()
    this.setFontAttr(font)
  },

  refreshPageFontSize: function () {
    const fontSize = window.zadark.storage.getFontSize()
    this.setFontSizeAttr(fontSize)
  },

  refreshHideLatestMessage: function () {
    const isEnabled = window.zadark.storage.getEnabledHideLatestMessage()
    if (isEnabled) {
      document.body.classList.add('zadark-prv--latest-message')
    } else {
      document.body.classList.remove('zadark-prv--latest-message')
    }
  },

  refreshHideThreadChatMessage: function () {
    const isEnabled = window.zadark.storage.getEnabledHideThreadChatMessage()
    if (isEnabled) {
      document.body.classList.add('zadark-prv--thread-chat-message')
    } else {
      document.body.classList.remove('zadark-prv--thread-chat-message')
    }

    if (!this.isMac()) {
      ipcRenderer.send('@ZaDark:UPDATE_SETTINGS', { hideThreadChatMessage: isEnabled })
    }
  },

  loadBlockSettings: function () {
    const settings = window.zadark.storage.getBlockSettings()

    const enableBlockIds = []
    const disableBlockIds = []

    BLOCK_IDS.forEach((blockId) => {
      if (settings[blockId]) {
        enableBlockIds.push(blockId)
      } else {
        disableBlockIds.push(blockId)
      }
    })

    ipcRenderer.send('@ZaDark:UPDATE_BLOCK_SETTINGS', {
      enableBlockIds,
      disableBlockIds
    })
  },

  getRatingURL: function () {
    return 'https://sourceforge.net/projects/zadark/reviews/new?stars=5'
  },

  getFeedbackURL: function (platformKey = 'win32') {
    const platformName = platformKey === 'darwin' ? 'macOS' : 'Windows'
    return `https://docs.google.com/forms/d/e/1FAIpQLSfy8AXwBO-myPPkbXboq5ubeMa0MCMWJTl0Ke66qCyCAiWG9g/viewform?usp=pp_url&entry.454875478=${platformName}`
  }
}

window.zadark.utils.refreshPageTheme()
window.zadark.utils.refreshPageFont()
window.zadark.utils.refreshPageFontSize()
window.zadark.utils.refreshHideLatestMessage()
window.zadark.utils.refreshHideThreadChatMessage()
window.zadark.utils.loadBlockSettings()

window.matchMedia('(prefers-color-scheme: dark)').addListener((event) => {
  const theme = window.zadark.storage.getTheme()
  if (theme === 'auto') {
    window.zadark.utils.setThemeAttr(event.matches ? 'dark' : 'light')
  }
})

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

const versionElName = '#js-ext-version'
const selectThemeElName = '#js-select-theme input:radio[name="theme"]'
const selectFontElName = '#js-select-font'
const selectFontSizeElName = '#js-select-font-size'

const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

const switchBlockTypingElName = '#js-switch-block-typing'
const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockDeliveredElName = '#js-switch-block-delivered'
// const switchBlockOnlineElName = '#js-switch-block-online'

const setSelectTheme = (theme) => {
  const options = ['light', 'dark', 'auto']
  options.forEach((option) => {
    $(selectThemeElName).filter(`[value="${option}"]`).prop('checked', option === theme)
  })
}

const setSelectFont = (font) => {
  $(selectFontElName).val(font)
}

const setSelectFontSize = (fontSize) => {
  $(selectFontSizeElName).val(fontSize)
}

const setSwitch = (elName, enabled) => {
  $(elName).prop('checked', enabled)
}

function handleThemeChange () {
  const theme = $(this).val()
  window.zadark.storage.saveTheme(theme)
  window.zadark.utils.refreshPageTheme()
  setSelectTheme(theme)
}

function handleFontChange () {
  const font = $(this).val()
  window.zadark.storage.saveFont(font)
  window.zadark.utils.refreshPageFont()
}

function handleFontSizeChange () {
  const fontSize = $(this).val()
  window.zadark.storage.saveFontSize(fontSize)
  window.zadark.utils.refreshPageFontSize()
}

function handleHideLatestMessageChange () {
  const isEnabled = $(this).is(':checked')
  window.zadark.storage.saveEnabledHideLatestMessage(isEnabled)
  window.zadark.utils.refreshHideLatestMessage()
}

function handleHideThreadChatMessageChange () {
  const isEnabled = $(this).is(':checked')
  window.zadark.storage.saveEnabledHideThreadChatMessage(isEnabled)
  window.zadark.utils.refreshHideThreadChatMessage()
}

const handleBlockSettingsChange = (elName, blockId) => {
  return () => {
    const isEnabled = $(elName).is(':checked')

    const payload = isEnabled
      ? { enableBlockIds: [blockId] }
      : { disableBlockIds: [blockId] }

    window.zadark.storage.saveBlockSettings(blockId, isEnabled)
    ipcRenderer.send('@ZaDark:UPDATE_BLOCK_SETTINGS', payload)
  }
}

const iconQuestionSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14">
    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z" fill="currentColor" />
  </svg>
`

const zadarkButtonHTML = `
  <div id="div_Main_TabZaDark" class="clickable leftbar-tab flx flx-col flx-al-c flx-center rel" data-id="div_Main_TabZaDark" data-translate-title="STR_MENU_ZADARK" title="ZaDark">
    <svg width="24" height="24" viewBox="0 0 336 336" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.000806072 167.484C0.284527 74.7006 75.3948 -0.284182 167.764 0.000809684C181.016 0.0416946 193.907 1.63028 206.268 4.59743C208.09 5.03469 209.381 6.66172 209.399 8.5429C209.417 10.4241 208.158 12.076 206.345 12.5488C151.203 26.9302 110.418 77.1876 110.235 137.092C110.017 208.377 167.37 266.343 238.337 266.562C263.059 266.638 286.161 259.7 305.789 247.614C307.386 246.631 309.444 246.867 310.78 248.185C312.116 249.504 312.386 251.568 311.435 253.188C282.267 302.895 228.343 336.189 166.737 335.999C74.3674 335.714 -0.282915 260.267 0.000806072 167.484Z" fill="currentColor"/>
      <path d="M284.255 176.183C286.752 166.785 288 159.507 288 154.35C288 152.974 286.315 151.37 282.944 149.536C279.698 147.702 277.513 146.785 276.389 146.785C275.391 146.785 274.891 146.9 274.891 147.129C273.768 150.109 271.458 154.063 267.963 158.991C264.467 163.92 261.72 167.186 259.723 168.791C256.477 170.625 249.61 171.542 239.124 171.542C228.762 171.542 223.581 171.14 223.581 170.338C223.581 167.817 231.633 156.069 247.738 135.095C263.968 114.12 275.953 99.6218 283.693 91.5989C284.692 90.682 285.191 90.0516 285.191 89.7077C285.191 86.2693 284.504 83.1748 283.131 80.4241C281.883 77.6733 280.759 75.8968 279.76 75.0946C277.513 74.4069 269.398 74.063 255.416 74.063C241.558 74.063 229.011 74.808 217.775 76.298C217.526 76.298 215.591 75.6103 211.97 74.235C208.35 72.745 204.792 72 201.296 72C200.797 72 199.735 74.1777 198.112 78.533C196.614 82.8882 195.179 87.8166 193.805 93.3181C192.557 98.8195 191.933 102.946 191.933 105.696C191.933 106.613 193.493 107.931 196.614 109.65C199.86 111.37 202.357 112.229 204.105 112.229L206.539 108.447C211.533 100.424 214.904 96.1261 216.652 95.553C220.397 93.8338 226.889 92.9742 236.127 92.9742C245.491 92.9742 250.172 93.318 250.172 94.0057C250.172 95.2665 245.553 101.628 236.315 113.089C227.076 124.436 217.213 136.585 206.727 149.536C196.365 162.487 190.185 170.911 188.187 174.808C188.062 175.266 188 176.47 188 178.418C188 180.367 188.687 182.946 190.06 186.155C191.558 189.364 192.931 190.968 194.18 190.968L252.794 189.421C256.914 189.421 259.473 189.479 260.472 189.593L263.281 190.281C269.149 191.427 273.456 192 276.202 192C277.576 192 278.449 191.828 278.824 191.484C279.948 190.567 281.758 185.467 284.255 176.183Z" fill="currentColor"/>
    </svg>
    <div class="lb-tab-title truncate" data-translate-inner="STR_MENU_ZADARK">ZaDark</div>
  </div>
`

const popupHeaderHTML = `
  <div class="zadark-popup__header">
    <div class="zadark-popup__header__logo">
      <a href="https://zadark.quaric.com" title="ZaDark – Zalo Dark Mode" target="_blank" class="zadark-popup__header__logo-link">
        <img src="zadark-lockup.svg" alt="ZaDark" class="zadark-popup__header__logo-img" />
      </a>
    </div>

    <div class="zadark-popup__header__menu-list">
      <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
        <a href="${window.zadark.utils.getRatingURL()}" title="Bình chọn" target="_blank">Bình chọn</a>
      </span>

      <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
        <a href="${window.zadark.utils.getFeedbackURL(document.documentElement.getAttribute('data-zadark-platform'))}" title="Phản hồi" target="_blank">Phản hồi</a>
      </span>

      <span class="zadark-popup__header__menu-item">
        <a href="https://zadark.quaric.com/blog/changelog" id="js-ext-version" title="Có gì mới trong phiên bản này?" target="_blank"></a>
      </span>
    </div>
  </div>
`

const popupMainHTML = `
  <div class="zadark-popup__main">
    <label class="zadark-form__label">Giao diện</label>

    <div class="zadark-panel">
      <div class="zadark-panel__body">
        <div id="js-select-theme" class="zadark-radio__list">
          <label class="zadark-radio">
            <input type="radio" name="theme" value="light" class="zadark-radio__input">
            <span class="zadark-radio__checkmark"></span>
            <span class="zadark-radio__label">
              <span>Sáng</span>
            </span>
          </label>

          <label class="zadark-radio">
            <input type="radio" name="theme" value="dark" class="zadark-radio__input">
            <span class="zadark-radio__checkmark"></span>
            <span class="zadark-radio__label">
              <span>Tối</span>
            </span>
          </label>

          <label class="zadark-radio">
            <input type="radio" name="theme" value="auto" class="zadark-radio__input">
            <span class="zadark-radio__checkmark"></span>
            <span class="zadark-radio__label">
              <span>Theo hệ thống</span>
            </span>
          </label>
        </div>

        <div class="select-font">
          <label class="select-font__label">Thay đổi phông chữ</label>

          <select id="js-select-font" class="zadark-select zadark-select--text-right">
            <option value="default">Mặc định</option>
            <option value="open-sans">Open Sans</option>
            <option value="inter">Inter</option>
            <option value="roboto">Roboto</option>
            <option value="lato">Lato</option>
            <option value="source-sans-pro">Source Sans Pro</option>
          </select>
        </div>

        <div class="select-font">
          <label class="select-font__label">Thay đổi cỡ chữ trong Trò chuyện</label>

          <select id="js-select-font-size" class="zadark-select zadark-select--text-right">
            <option value="small">Nhỏ</option>
            <option value="medium">Trung bình</option>
            <option value="big">Lớn</option>
            <option value="very-big">Rất lớn</option>
          </select>
        </div>
      </div>
    </div>

    <div id="js-panel-privacy" class="not-available">
      <label class="zadark-form__label">Riêng tư</label>

      <div class="zadark-panel">
        <div class="zadark-panel__body">
          <div class="zadark-switch__list">
            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-latest-message">
                Ẩn&nbsp;<strong>Tin nhắn gần nhất</strong>&nbsp;trong Danh sách trò chuyện
                <span class="zadark-switch__label--helper-icon" data-tippy-content="<p>Tin nhắn gần nhất trong Danh sách trò chuyện (bên trái) sẽ được ẩn để hạn chế người khác nhìn trộm tin nhắn.</p><p>Để xem nội dung, bạn di chuyển chuột hoặc nhấn vào Cuộc trò chuyện.</p>"></span>
              </label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-latest-message">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label zadark-switch__label--helper" for="js-switch-hide-thread-chat-message">
                Ẩn&nbsp;<strong>Tin nhắn</strong>&nbsp;trong Trò chuyện${!window.zadark.utils.isMac() ? ' & Thông báo' : ''}
                <span class="zadark-switch__label--helper-icon" data-tippy-content="<p>Tin nhắn trong Trò chuyện${!window.zadark.utils.isMac() ? ' & Thông báo' : ''} sẽ được làm mờ để hạn chế người khác nhìn trộm tin nhắn.</p><p>Để xem nội dung, bạn di chuyển chuột vào Vùng hiển thị tin nhắn. Di chuyển chuột khỏi Vùng hiển thị tin nhắn để ẩn tin nhắn.</p>"></span>
              </label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-thread-chat-message">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-typing">Ẩn trạng thái <strong>Đang soạn tin nhắn ...</strong></label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-typing">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-delivered">Ẩn trạng thái <strong>Đã nhận</strong> tin nhắn</label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-delivered">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-seen">Ẩn trạng thái <strong>Đã xem</strong> tin nhắn</label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-seen">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`

const popupFooterHTML = `
  <div class="zadark-popup__footer">
    <div class="zadark-publisher">
      <span class="zadark-publisher__from">ZaDark from</span>
      <img src="quaric-lockup-dark.svg" class="zadark-publisher__lockup zadark-publisher__lockup--dark">
      <img src="quaric-lockup-light.svg" class="zadark-publisher__lockup zadark-publisher__lockup--light">
    </div>
  </div>
`

const zadarkPopupHTML = `
  <div id="zadark-popup" class="zadark-popper">
    ${popupHeaderHTML}
    ${popupMainHTML}
    ${popupFooterHTML}
  </div>
`

const loadPopupState = () => {
  const theme = window.zadark.storage.getTheme()
  setSelectTheme(theme)

  const font = window.zadark.storage.getFont()
  setSelectFont(font)

  const fontSize = window.zadark.storage.getFontSize()
  setSelectFontSize(fontSize)

  const enabledHideLatestMessage = window.zadark.storage.getEnabledHideLatestMessage()
  setSwitch(switchHideLatestMessageElName, enabledHideLatestMessage)

  const enabledHideThreadChatMessage = window.zadark.storage.getEnabledHideThreadChatMessage()
  setSwitch(switchHideThreadChatMessageElName, enabledHideThreadChatMessage)

  const blockSettings = window.zadark.storage.getBlockSettings()
  setSwitch(switchBlockTypingElName, blockSettings.block_typing)
  setSwitch(switchBlockDeliveredElName, blockSettings.block_delivered)
  setSwitch(switchBlockSeenElName, blockSettings.block_seen)
  // setSwitch(switchBlockOnlineElName, blockSettings.block_online)
}

const loadKnownVersionState = (buttonEl) => {
  const knownVersion = window.zadark.storage.getKnownVersion()
  const zadarkVersion = $('html').data('zadark-version')

  if (`${knownVersion}` !== `${zadarkVersion}`) {
    buttonEl.classList.add('zadark-known-version')
  }
}

const updateKnownVersionState = (buttonEl) => {
  const zadarkVersion = $('html').data('zadark-version')
  window.zadark.storage.saveKnownVersion(zadarkVersion)

  buttonEl.classList.remove('zadark-known-version')
}

const openZaDarkPopup = (popupInstance, buttonEl, popupEl) => {
  return () => {
    loadPopupState()
    updateKnownVersionState(buttonEl)

    buttonEl.classList.add('selected')
    popupEl.setAttribute('data-visible', '')

    popupInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: true }
      ]
    }))

    popupInstance.update()
  }
}

const hideZaDarkPopup = (popupInstance, buttonEl, popupEl) => {
  return (event) => {
    const isOpen = popupEl.getAttribute('data-visible') !== null
    const isClickOutside = isOpen && !popupEl.contains(event.target) && !buttonEl.contains(event.target)

    if (!isClickOutside) {
      return
    }

    buttonEl.classList.remove('selected')
    popupEl.removeAttribute('data-visible')

    popupInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: false }
      ]
    }))
  }
}

const loadZaDarkPopup = () => {
  const [zaloTabsBottomEl] = document.querySelectorAll('.nav__tabs__bottom')

  if (!zaloTabsBottomEl) {
    return
  }

  zaloTabsBottomEl.insertAdjacentHTML('afterbegin', zadarkButtonHTML)

  const zaloAppBody = document.body
  zaloAppBody.insertAdjacentHTML('beforeend', zadarkPopupHTML)

  const zadarkVersion = $('html').data('zadark-version')
  $(versionElName).html(`Phiên bản ${zadarkVersion}`)

  $(selectThemeElName).on('change', handleThemeChange)
  $(selectFontElName).on('change', handleFontChange)
  $(selectFontSizeElName).on('change', handleFontSizeChange)

  $(switchHideLatestMessageElName).on('change', handleHideLatestMessageChange)
  $(switchHideThreadChatMessageElName).on('change', handleHideThreadChatMessageChange)

  $(switchBlockTypingElName).on('change', handleBlockSettingsChange(switchBlockTypingElName, 'block_typing'))
  $(switchBlockSeenElName).on('change', handleBlockSettingsChange(switchBlockSeenElName, 'block_seen'))
  $(switchBlockDeliveredElName).on('change', handleBlockSettingsChange(switchBlockDeliveredElName, 'block_delivered'))
  // $(switchBlockOnlineElName).on('change', handleBlockSettingsChange(switchBlockOnlineElName, 'block_online'))

  const popupEl = document.querySelector('#zadark-popup')
  const buttonEl = document.getElementById('div_Main_TabZaDark')

  const popupInstance = Popper.createPopper(buttonEl, popupEl, {
    placement: 'auto-end',
    modifiers: []
  })

  const hideEvents = ['click', 'contextmenu']
  buttonEl.addEventListener('click', openZaDarkPopup(popupInstance, buttonEl, popupEl))
  hideEvents.forEach((eventName) => {
    window.addEventListener(
      eventName,
      hideZaDarkPopup(popupInstance, buttonEl, popupEl),
      true
    )
  })

  loadPopupState()
  loadKnownVersionState(buttonEl)

  $('.zadark-switch__label--helper-icon[data-tippy-content]').html(iconQuestionSVG)

  tippy('[data-tippy-content]', {
    theme: 'zadark',
    allowHTML: true
  })
}
