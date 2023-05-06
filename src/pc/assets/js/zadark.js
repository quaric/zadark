/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

// eslint-disable-next-line no-global-assign
const $ = jQuery = module.exports // Ref: https://github.com/electron/electron/issues/345#issuecomment-43894441

const ZADARK_THEME_KEY = '@ZaDark:THEME'
const ZADARK_FONT_KEY = '@ZaDark:FONT'
const ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_LATEST_MESSAGE'
const ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY = '@ZaDark:ENABLED_HIDE_THREAD_CHAT_MESSAGE'
const ZADARK_KNOWN_VERSION_KEY = '@ZaDark:KNOWN_VERSION'

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

  saveEnabledHideLatestMessage: (enabled) => {
    return localStorage.setItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY, enabled)
  },

  getEnabledHideLatestMessage: () => {
    return localStorage.getItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY) === 'true'
  },

  saveEnabledHideThreadChatMessage: (enabled) => {
    return localStorage.setItem(ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY, enabled)
  },

  getEnabledHideThreadChatMessage: () => {
    return localStorage.getItem(ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY) === 'true'
  },

  getKnownVersion: () => {
    return localStorage.getItem(ZADARK_KNOWN_VERSION_KEY) || '0.0'
  },

  saveKnownVersion: (version) => {
    return localStorage.setItem(ZADARK_KNOWN_VERSION_KEY, version)
  }
}

window.zadark.utils = {
  setThemeAttr: (themeMode) => {
    document.documentElement.setAttribute('data-zadark-theme', themeMode)
  },

  setFontAttr: (font) => {
    document.documentElement.setAttribute('data-zadark-font', font)
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
  },

  refreshPageFont: function () {
    const font = window.zadark.storage.getFont()
    this.setFontAttr(font)
  },

  refreshHideLatestMessage: function () {
    const enabledHideLatestMessage = window.zadark.storage.getEnabledHideLatestMessage()
    if (enabledHideLatestMessage) {
      document.body.classList.add('zadark-prv--latest-message')
    } else {
      document.body.classList.remove('zadark-prv--latest-message')
    }
  },

  refreshHideThreadChatMessage: function () {
    const enabledHideThreadChatMessage = window.zadark.storage.getEnabledHideThreadChatMessage()
    if (enabledHideThreadChatMessage) {
      document.body.classList.add('zadark-prv--thread-chat-message')
    } else {
      document.body.classList.remove('zadark-prv--thread-chat-message')
    }
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
window.zadark.utils.refreshHideLatestMessage()
window.zadark.utils.refreshHideThreadChatMessage()

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
const switchHideLatestMessageElName = '#js-switch-hide-latest-message'
const switchHideThreadChatMessageElName = '#js-switch-hide-thread-chat-message'

const setSelectTheme = (theme) => {
  const options = ['light', 'dark', 'auto']
  options.forEach((option) => {
    $(selectThemeElName).filter(`[value="${option}"]`).prop('checked', option === theme)
  })
}

const setSelectFont = (font) => {
  $(selectFontElName).val(font)
}

const setSwitchHideLatestMessage = (enabled) => {
  $(switchHideLatestMessageElName).prop('checked', enabled)
}

const setSwitchHideThreadChatMessage = (enabled) => {
  $(switchHideThreadChatMessageElName).prop('checked', enabled)
}

async function handleThemeChange () {
  const theme = $(this).val()
  window.zadark.storage.saveTheme(theme)
  window.zadark.utils.refreshPageTheme()
  setSelectTheme(theme)
}

async function handleFontChange () {
  const font = $(this).val()
  window.zadark.storage.saveFont(font)
  window.zadark.utils.refreshPageFont()
}

async function handleHideLatestMessageChange () {
  const isEnabled = $(this).is(':checked')
  window.zadark.storage.saveEnabledHideLatestMessage(isEnabled)
  window.zadark.utils.refreshHideLatestMessage()
}

async function handleHideThreadChatMessageChange () {
  const isEnabled = $(this).is(':checked')
  window.zadark.storage.saveEnabledHideThreadChatMessage(isEnabled)
  window.zadark.utils.refreshHideThreadChatMessage()
}

const iconQuestionSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14">
    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z" fill="currentColor" />
  </svg>
`

const zadarkButtonHTML = `
  <div id="div_Main_TabZaDark" class="clickable leftbar-tab flx flx-col flx-al-c flx-center rel" data-id="div_Main_TabZaDark" data-translate-title="STR_MENU_ZADARK" title="ZaDark">
    <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M458.795 458.862C507.089 410.608 512 341.148 512 256.249C512 171.255 507.036 101.732 458.634 53.496C410.33 5.378 340.875 0 256 0C171.018 0 101.458 5.44 53.174 53.688C4.897 101.916 0 171.364 0 256.249C0 341.148 4.897 410.617 53.194 458.862C101.475 507.117 171.027 512.001 256 512.001C340.974 512.001 410.514 507.117 458.795 458.862ZM70.1382 70.6649L70.1359 70.6672C29.8326 110.93 24 170.053 24 256.249C24 342.459 29.8325 401.603 70.1554 441.882L70.16 441.887C110.475 482.18 169.707 488.001 256 488.001C342.293 488.001 401.514 482.18 441.829 441.887L441.831 441.884C482.155 401.594 488 342.452 488 256.249C488 169.962 482.103 110.771 441.696 70.4993C401.304 30.2627 342.012 24 256 24C169.889 24 110.509 30.3244 70.1382 70.6649Z" fill="currentColor"/>
      <path d="M88.0008 255.484C88.2845 162.701 163.395 87.7158 255.764 88.0008C269.016 88.0417 281.907 89.6303 294.268 92.5974C296.09 93.0347 297.381 94.6617 297.399 96.5429C297.417 98.4241 296.158 100.076 294.345 100.549C239.203 114.93 198.418 165.188 198.235 225.092C198.017 296.377 255.37 354.343 326.337 354.562C351.059 354.638 374.161 347.7 393.789 335.614C395.386 334.631 397.444 334.867 398.78 336.185C400.116 337.504 400.386 339.568 399.435 341.188C370.267 390.895 316.343 424.189 254.737 423.999C162.367 423.714 87.7171 348.267 88.0008 255.484Z" fill="currentColor"/>
      <path d="M372.255 264.183C374.752 254.785 376 247.507 376 242.35C376 240.974 374.315 239.37 370.944 237.536C367.698 235.702 365.513 234.785 364.389 234.785C363.391 234.785 362.891 234.9 362.891 235.129C361.768 238.109 359.458 242.063 355.963 246.991C352.467 251.92 349.72 255.186 347.723 256.791C344.477 258.625 337.61 259.542 327.124 259.542C316.762 259.542 311.581 259.14 311.581 258.338C311.581 255.817 319.633 244.069 335.738 223.095C351.968 202.12 363.953 187.622 371.693 179.599C372.692 178.682 373.191 178.052 373.191 177.708C373.191 174.269 372.504 171.175 371.131 168.424C369.883 165.673 368.759 163.897 367.76 163.095C365.513 162.407 357.398 162.063 343.416 162.063C329.558 162.063 317.011 162.808 305.775 164.298C305.526 164.298 303.591 163.61 299.97 162.235C296.35 160.745 292.792 160 289.296 160C288.797 160 287.735 162.178 286.112 166.533C284.614 170.888 283.179 175.817 281.805 181.318C280.557 186.819 279.933 190.946 279.933 193.696C279.933 194.613 281.493 195.931 284.614 197.65C287.86 199.37 290.357 200.229 292.105 200.229L294.539 196.447C299.533 188.424 302.904 184.126 304.652 183.553C308.397 181.834 314.889 180.974 324.127 180.974C333.491 180.974 338.172 181.318 338.172 182.006C338.172 183.266 333.553 189.628 324.315 201.089C315.076 212.436 305.213 224.585 294.727 237.536C284.365 250.487 278.185 258.911 276.187 262.808C276.062 263.266 276 264.47 276 266.418C276 268.367 276.687 270.946 278.06 274.155C279.558 277.364 280.931 278.968 282.18 278.968L340.794 277.421C344.914 277.421 347.473 277.479 348.472 277.593L351.281 278.281C357.149 279.427 361.456 280 364.202 280C365.576 280 366.449 279.828 366.824 279.484C367.948 278.567 369.758 273.467 372.255 264.183Z" fill="currentColor"/>
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
                Ẩn&nbsp;<strong>Tin nhắn</strong>&nbsp;trong Cuộc trò chuyện
                <span class="zadark-switch__label--helper-icon" data-tippy-content="<p>Tin nhắn trong Cuộc trò chuyện sẽ được làm mờ để hạn chế người khác nhìn trộm tin nhắn.</p><p>Để xem nội dung, bạn di chuyển chuột vào Vùng hiển thị tin nhắn. Di chuyển chuột khỏi Vùng hiển thị tin nhắn để ẩn tin nhắn.</p>"></span>
              </label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-hide-thread-chat-message">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch zadark-switch--disabled">
              <label class="zadark-switch__label" for="js-switch-block-typing">Ẩn trạng thái <strong>Đang soạn tin nhắn ...</strong></label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-typing">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch zadark-switch--disabled">
              <label class="zadark-switch__label" for="js-switch-block-delivered">Ẩn trạng thái <strong>Đã nhận</strong> tin nhắn</label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-delivered">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch zadark-switch--disabled">
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

  const enabledHideLatestMessage = window.zadark.storage.getEnabledHideLatestMessage()
  setSwitchHideLatestMessage(enabledHideLatestMessage)

  const enabledHideThreadChatMessage = window.zadark.storage.getEnabledHideThreadChatMessage()
  setSwitchHideThreadChatMessage(enabledHideThreadChatMessage)
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
  $(switchHideLatestMessageElName).on('change', handleHideLatestMessageChange)
  $(switchHideThreadChatMessageElName).on('change', handleHideThreadChatMessageChange)

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

  $('[data-tippy-content]').html(iconQuestionSVG)

  tippy('[data-tippy-content]', {
    theme: 'zadark',
    allowHTML: true
  })
}
