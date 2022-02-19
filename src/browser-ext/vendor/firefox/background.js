/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: 'welcome.html' })
  }

  if (details.reason === 'update') {
    browser.tabs.create({ url: 'changelog.html' })
  }
})
