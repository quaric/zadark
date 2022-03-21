/*
  ZaDark – Best Dark Theme for Zalo
  Browser Extension
  Made by NCDAi Studio
*/

const manifestData = window.zadark.browser.getManifest()
$('#ext-version1, #ext-version2').html(`v${manifestData.version}`)

window.zadark.utils.refreshPageTheme()

// Receive update notifications

const checkboxReceiveUpdateNotiElName = '#checkbox-receive-update-noti'

window.zadark.browser.getExtensionSettings().then(({ isReceiveUpdateNoti }) => {
  $(checkboxReceiveUpdateNotiElName).prop('checked', isReceiveUpdateNoti)
})

$(checkboxReceiveUpdateNotiElName).on('change', () => {
  const isReceiveUpdateNoti = $(checkboxReceiveUpdateNotiElName).is(':checked')
  window.zadark.browser.saveExtensionSettings({ isReceiveUpdateNoti })
})
