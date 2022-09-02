/*
  ZaDark – Zalo Dark Mode
  Safari Extension
  Made by NCDAi Studio
*/

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    browser.storage.sync.get({ isReceiveUpdateNoti: true }, ({ isReceiveUpdateNoti }) => {
      if (isReceiveUpdateNoti) {
        browser.tabs.create({ url: 'changelog.html' })
      }
    })
  }

  // Init Storage
  browser.storage.sync.set({
    themeMode: 'custom',
    customTheme: 'dark',
    isReceiveUpdateNoti: true
  })
})
