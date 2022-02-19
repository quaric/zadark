/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

const manifestData = window.zadark.browser.getManifest()
$('#ext-version1, #ext-version2').html(`v${manifestData.version}`)

$('#ext-links-home').on('click', () => {
  window.zadark.browser.createTab({ url: 'welcome.html' })
})

window.zadark.utils.refreshPageTheme()
