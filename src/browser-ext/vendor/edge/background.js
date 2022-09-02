/*
  ZaDark – Zalo Dark Mode
  Microsoft Edge Extension
  Made by NCDAi Studio
*/

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://zadark.ncdaistudio.com/browser-ext/edge' })
  }

  if (details.reason === 'update') {
    chrome.storage.sync.get({ isReceiveUpdateNoti: true }, ({ isReceiveUpdateNoti }) => {
      if (isReceiveUpdateNoti) {
        chrome.tabs.create({ url: 'changelog.html' })
      }
    })
  }

  // Init Storage
  chrome.storage.sync.set({
    themeMode: 'custom',
    customTheme: 'dark',
    isReceiveUpdateNoti: true
  })
})
