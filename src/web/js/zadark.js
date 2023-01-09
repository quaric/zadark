/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

window.zadark.browser.initClassNames()
window.zadark.utils.refreshPageTheme()

const MSG_ACTIONS = {
  CHANGE_THEME: '@ZaDark:CHANGE_THEME',
  GET_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:GET_ENABLED_BLOCKING_RULE_IDS',
  UPDATE_ENABLED_BLOCKING_RULE_IDS: '@ZaDark:UPDATE_ENABLED_BLOCKING_RULE_IDS'
}

const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode) => {
      if (addedNode.id === 'app-page') {
        loadZaDarkPopup()
        loadWelcomeScreen()
        observer.disconnect()
      }
    })
  })
})

observer.observe(document.querySelector('#app'), { subtree: false, childList: true })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === MSG_ACTIONS.CHANGE_THEME) {
    window.zadark.utils.refreshPageTheme()
    setSelectTheme(message.payload.theme)
    sendResponse({ received: true })
  }
})

const versionElName = '#js-ext-version'
const selectThemeElName = '#js-select-theme input:radio[name="theme"]'

const panelPrivacyElName = '#js-panel-privacy'
const switchBlockTypingElName = '#js-switch-block-typing'
const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockDeliveredElName = '#js-switch-block-delivered'

const setSelectTheme = (theme) => {
  const options = ['light', 'dark', 'auto']
  options.forEach((option) => {
    $(selectThemeElName).filter(`[value="${option}"]`).prop('checked', option === theme)
  })
}

async function handleSelectThemeChange () {
  const theme = $(this).val()
  await window.zadark.browser.saveExtensionSettings({ theme })
  window.zadark.utils.refreshPageTheme()
  setSelectTheme(theme)
}

const handleBlockingRuleChange = (elName, ruleId) => {
  return async () => {
    const isChecked = $(elName).is(':checked')

    const payload = isChecked
      ? { enableRuleIds: [ruleId] }
      : { disableRuleIds: [ruleId] }

    chrome.runtime.sendMessage({ action: MSG_ACTIONS.UPDATE_ENABLED_BLOCKING_RULE_IDS, payload })
  }
}

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
        <img src="${chrome.runtime.getURL('images/zadark-lockup.svg')}" alt="ZaDark" class="zadark-popup__header__logo-img" />
      </a>
    </div>

    <div class="zadark-popup__header__menu-list">
      <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
        <a href="https://zadark.quaric.com" title="Website chính thức" target="_blank">Website</a>
      </span>

      <span class="zadark-popup__header__menu-item zadark-popup__header__menu-divider">
        <a href="https://zadark.quaric.com/donate" title="Donate" target="_blank">Donate</a>
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
              <span>Tự động</span>
              <span>Giao diện Zalo Web sẽ thay đổi theo Hệ điều hành</span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <div id="js-panel-privacy">
      <label class="zadark-form__label">Riêng tư</label>

      <div class="zadark-panel">
        <div class="zadark-panel__body">
          <div class="zadark-switch__list">
            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-typing">Ẩn trạng thái "Đang soạn tin nhắn" trên Zalo Web</label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-typing">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-delivered">Ẩn trạng thái "Đã nhận" tin nhắn trên Zalo Web</label>
              <label class="zadark-switch__checkbox">
                <input class="zadark-switch__input" type="checkbox" id="js-switch-block-delivered">
                <span class="zadark-switch__slider"></span>
              </label>
            </div>

            <div class="zadark-switch">
              <label class="zadark-switch__label" for="js-switch-block-seen">Ẩn trạng thái "Đã xem" tin nhắn trên Zalo Web</label>
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
      <img src="${chrome.runtime.getURL('images/quaric-lockup-dark.svg')}" class="zadark-publisher__lockup zadark-publisher__lockup--dark">
      <img src="${chrome.runtime.getURL('images/quaric-lockup-light.svg')}" class="zadark-publisher__lockup zadark-publisher__lockup--light">
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

const loadPopupState = async () => {
  const { theme } = await window.zadark.browser.getExtensionSettings()
  setSelectTheme(theme)

  const isSupportPrivacy = window.zadark.utils.getIsSupportPrivacy()

  if (isSupportPrivacy) {
    const ruleIds = await chrome.runtime.sendMessage({ action: MSG_ACTIONS.GET_ENABLED_BLOCKING_RULE_IDS })
    $(switchBlockTypingElName).prop('checked', ruleIds.includes('rules_block_typing'))
    $(switchBlockSeenElName).prop('checked', ruleIds.includes('rules_block_seen'))
    $(switchBlockDeliveredElName).prop('checked', ruleIds.includes('rules_block_delivered'))
  } else {
    $(panelPrivacyElName).hide()
  }
}

const openZaDarkPopup = (popupInstance, buttonEl, popupEl) => {
  return () => {
    loadPopupState()

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

  const zadarkVersion = window.zadark.browser.getManifest().version
  $(versionElName).html(`Phiên bản ${zadarkVersion}`)
  $(selectThemeElName).on('change', handleSelectThemeChange)
  $(switchBlockTypingElName).on('change', handleBlockingRuleChange(switchBlockTypingElName, 'rules_block_typing'))
  $(switchBlockSeenElName).on('change', handleBlockingRuleChange(switchBlockSeenElName, 'rules_block_seen'))
  $(switchBlockDeliveredElName).on('change', handleBlockingRuleChange(switchBlockDeliveredElName, 'rules_block_delivered'))

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
}

const loadWelcomeScreen = () => {
  const welcomeScreenTitleEl = $('[data-translate-inner="STR_WELCOME_SCREEN_MAIN_TITLE"]')
  welcomeScreenTitleEl.parent().html(`
    <span-22 data-translate-inner="STR_WELCOME_SCREEN_MAIN_TITLE" style="color: var(--N80);">${welcomeScreenTitleEl.text()}</span-22>
    <div style="display: flex; align-items: center; justify-content: center; margin-top: 4px;">
      <span-b32>ZaDark</span-b32>
      <span-24 style="margin-left: 8px; margin-right: 8px; color: var(--N40);">=</span-24>
      <span-b32>Zalo</span-b32>
      <span-24 style="margin-left: 8px; margin-right: 8px; color: var(--N40);">+</span-24>
      <span-b32>Dark Mode</span-b32>
    </div>
  `)

  const welcomeScreenSubTitleEl = $('[data-translate-inner="STR_WELCOME_SCREEN_MAIN_SUBTITLE"]')
  welcomeScreenSubTitleEl.html(`ZaDark là tiện ích giúp kích hoạt Dark Mode cho Zalo PC và Web.</br>${welcomeScreenSubTitleEl.text()}`)
}
