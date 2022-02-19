/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

const selectThemeModeElName = '#select-theme-mode'
const selectUserThemeElName = '#select-user-theme input:radio[name="user_theme"]'
const selectDarkThemeElName = '#select-dark-theme input:radio[name="dark_theme"]'

const themeModeSingleElName = '#theme-mode-single'
const themeModeAutoElName = '#theme-mode-auto'

const themeModeSingleDescElName = '.theme-mode-description[data-theme-mode="single"]'
const themeModeAutoDescElName = '.theme-mode-description[data-theme-mode="auto"]'

const manifestData = window.zadark.browser.getManifest()
$('#ext-version').html(`Version ${manifestData.version}`)

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

$(selectThemeModeElName).on('change', function () {
  const themeMode = $(this).val()
  window.zadark.browser.saveExtensionSettings({ themeMode })
  updateThemeMode(themeMode)
  fireThemeSettingsChanged()
})

$(selectUserThemeElName).on('change', function () {
  const userTheme = $(this).val()
  window.zadark.browser.saveExtensionSettings({ userTheme })
  fireThemeSettingsChanged()
})

$(selectDarkThemeElName).on('change', function () {
  const darkTheme = $(this).val()
  window.zadark.browser.saveExtensionSettings({ darkTheme })
  fireThemeSettingsChanged()
})

$('#ext-links-home').on('click', () => {
  window.zadark.browser.createTab({ url: 'welcome.html' })
})

$('#ext-version').on('click', () => {
  window.zadark.browser.createTab({ url: 'changelog.html' })
})
