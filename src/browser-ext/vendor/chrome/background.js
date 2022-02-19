/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'welcome.html' })
  }

  if (details.reason === 'update') {
    chrome.tabs.create({ url: 'changelog.html' })
  }
})
