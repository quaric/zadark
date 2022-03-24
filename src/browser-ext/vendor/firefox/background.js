/*
  ZaDark – Best Dark Theme for Zalo
  Firefox Extension
  Made by NCDAi Studio
*/

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: 'https://zadark.ncdaistudio.com/browser-ext/firefox' })
  }

  if (details.reason === 'update') {
    browser.storage.sync.get({ isReceiveUpdateNoti: true }, ({ isReceiveUpdateNoti }) => {
      if (isReceiveUpdateNoti) {
        browser.tabs.create({ url: 'changelog.html' })
      }
    })
  }
})
