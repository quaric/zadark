/*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by NCDAi Studio
*/

const manifestData = window.zadark.browser.getManifest()
$('#js-ext-version-in-header').html(`Phiên bản ${manifestData.version}`)
$('#js-ext-version-in-content').html(manifestData.version)

window.zadark.utils.refreshPageTheme()

// Receive update notifications

const checkboxReceiveUpdateNotiElName = '#js-checkbox-receive-update-noti'

window.zadark.browser.getExtensionSettings().then(({ isReceiveUpdateNoti }) => {
  $(checkboxReceiveUpdateNotiElName).prop('checked', isReceiveUpdateNoti)
})

$(checkboxReceiveUpdateNotiElName).on('change', () => {
  const isReceiveUpdateNoti = $(checkboxReceiveUpdateNotiElName).is(':checked')
  window.zadark.browser.saveExtensionSettings({ isReceiveUpdateNoti })
})
