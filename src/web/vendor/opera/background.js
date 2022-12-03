/*
  ZaDark – Zalo Dark Mode
  Opera Extension
  Made by Quaric
*/

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://zadark.quaric.com/web/opera' })
  }

  if (details.reason === 'update') {
    chrome.storage.sync.get({ isReceiveUpdateNoti: true }, ({ isReceiveUpdateNoti }) => {
      if (isReceiveUpdateNoti) {
        chrome.tabs.create({ url: 'changelog.html' })
      }
    })
  }
})
