/*
  ZaDark – Zalo Dark Mode
  Firefox Extension
  Made by Quaric
*/

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: 'https://zadark.quaric.com/web/firefox' })
  }
})
