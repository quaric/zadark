/*
  ZaDark – Zalo Dark Mode
  Chrome Extension
  Made by NCDAi Studio
*/

const menus = [
  {
    id: 'help',
    title: 'Trợ giúp',
    contexts: ['action'],
    onClick: () => {
      chrome.tabs.create({ url: 'https://zadark.ncdaistudio.com/contact' })
    }
  },
  {
    id: 'donate',
    title: 'Ủng hộ ZaDark',
    contexts: ['action'],
    onClick: () => {
      chrome.tabs.create({ url: 'https://zadark.ncdaistudio.com/donate' })
    }
  },
  {
    id: 'rate',
    title: 'Đánh giá trên Chrome Web Store',
    contexts: ['action'],
    onClick: () => {
      chrome.tabs.create({ url: 'https://chrome.google.com/webstore/detail/llfhpkkeljlgnjgkholeppfnepmjppob' })
    }
  }
]

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://zadark.ncdaistudio.com/browser-ext/chrome' })
  }

  if (details.reason === 'update') {
    chrome.storage.sync.get({ isReceiveUpdateNoti: true }, ({ isReceiveUpdateNoti }) => {
      if (isReceiveUpdateNoti) {
        chrome.tabs.create({ url: 'changelog.html' })
      }
    })
  }

  menus.forEach((menu) => {
    chrome.contextMenus.create({
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts
    })
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const menu = menus.find((menu) => menu.id === info.menuItemId)
  if (menu) {
    menu.onClick()
  }
})
