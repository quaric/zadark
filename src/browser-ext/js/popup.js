/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by NCDAi Studio
*/

const versionElName = '#js-ext-version'

const selectThemeModeElName = '#js-select-theme-mode'
const selectUserThemeElName = '#js-select-user-theme input:radio[name="user_theme"]'
const selectDarkThemeElName = '#js-select-dark-theme input:radio[name="dark_theme"]'

const themeModeSingleElName = '#js-theme-mode-single'
const themeModeAutoElName = '#js-theme-mode-auto'

const themeModeSingleDescElName = '.theme-mode-description[data-theme-mode="single"]'
const themeModeAutoDescElName = '.theme-mode-description[data-theme-mode="auto"]'

const switchBlockSeenElName = '#js-switch-block-seen'
const switchBlockTypingElName = '#js-switch-block-typing'

const manifestData = window.zadark.browser.getManifest()

$(versionElName).html(`Phiên bản ${manifestData.version}`)

$(versionElName).on('click', () => {
  window.zadark.browser.createTab({ url: 'changelog.html' })
})

// Theme

window.zadark.utils.refreshPageTheme()

const updateThemeMode = (themeMode) => {
  $(themeModeSingleElName).hide()
  $(themeModeAutoElName).hide()

  $(themeModeSingleDescElName).hide()
  $(themeModeAutoDescElName).hide()

  if (themeMode === 'single') {
    $(themeModeSingleElName).show()
    $(themeModeSingleDescElName).show()
  } else {
    $(themeModeAutoElName).show()
    $(themeModeAutoDescElName).show()
  }
}

window.zadark.browser.getExtensionSettings().then(({ themeMode, userTheme, darkTheme }) => {
  updateThemeMode(themeMode)

  $(selectThemeModeElName).val(themeMode)
  $(selectUserThemeElName).filter(`[value="${userTheme}"]`).attr('checked', true)
  $(selectDarkThemeElName).filter(`[value="${darkTheme}"]`).attr('checked', true)
})

const setPageThemeForAllZaloTabs = async () => {
  // Get all Zalo tabs
  const tabs = await window.zadark.browser.getZaloTabs()

  const hasResult = Array.isArray(tabs) && tabs.length > 0
  if (!hasResult) {
    return
  }

  // Set page theme for all Zalo tabs
  tabs.forEach((tab) => {
    window.zadark.browser.executeScript(tab.id, 'js/execute-script.js')
  })
}

const fireThemeSettingsChanged = () => {
  // Set page theme for all Zalo tabs
  setPageThemeForAllZaloTabs()

  // Set popup theme
  window.zadark.utils.refreshPageTheme()
}

$(selectThemeModeElName).on('change', async function () {
  const themeMode = $(this).val()
  await window.zadark.browser.saveExtensionSettings({ themeMode })
  updateThemeMode(themeMode)
  fireThemeSettingsChanged()
})

$(selectUserThemeElName).on('change', async function () {
  const userTheme = $(this).val()
  await window.zadark.browser.saveExtensionSettings({ userTheme })
  fireThemeSettingsChanged()
})

$(selectDarkThemeElName).on('change', async function () {
  const darkTheme = $(this).val()
  await window.zadark.browser.saveExtensionSettings({ darkTheme })
  fireThemeSettingsChanged()
})

// Privacy

window.zadark.browser.getEnabledBlockingRuleIds().then((ruleIds) => {
  $(switchBlockSeenElName).prop('checked', ruleIds.includes('rules_block_seen'))
  $(switchBlockTypingElName).prop('checked', ruleIds.includes('rules_block_typing'))
})

const handleBlockingRuleChange = function (elName, ruleId) {
  return function () {
    const isChecked = $(elName).is(':checked')
    window.zadark.browser.updateEnabledBlockingRuleIds(isChecked
      ? { enableRuleIds: [ruleId] }
      : { disableRuleIds: [ruleId] }
    )
  }
}

$(switchBlockSeenElName).on('change', handleBlockingRuleChange(switchBlockSeenElName, 'rules_block_seen'))
$(switchBlockTypingElName).on('change', handleBlockingRuleChange(switchBlockTypingElName, 'rules_block_typing'))
