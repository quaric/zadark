/*
  ZaDark – Zalo Dark Mode
  Opera Extension
  Made by NCDAi Studio
*/

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://zadark.ncdaistudio.com/browser-ext/opera' })
  }

  if (details.reason === 'update') {
    chrome.storage.sync.get({ isReceiveUpdateNoti: true }, ({ isReceiveUpdateNoti }) => {
      if (isReceiveUpdateNoti) {
        chrome.tabs.create({ url: 'changelog.html' })
      }
    })
  }
})

// Global variables
const _enabledBlockingRuleIds = new Set()
const _blockingRules = [
  {
    id: 'rules_block_typing',
    urlFilters: [
      'https://*.chat.zalo.me/api/message/typing*'
    ]
  },
  {
    id: 'rules_block_seen',
    urlFilters: [
      'https://*.chat.zalo.me/api/message/seenv2*',
      'https://*.chat.zalo.me/api/group/seenv2*'
    ]
  }
]
const _onBeforeRequestOptions = ['blocking']

const updateEnabledRulesetIds = (enabledBlockingRuleIdsRef = new Set(), options) => {
  const { enableRuleIds = [], disableRuleIds = [] } = options

  enableRuleIds
    .forEach((id) => {
      if (id) {
        enabledBlockingRuleIdsRef.add(id)
      }
    })

  disableRuleIds
    .forEach((id) => {
      if (id) {
        enabledBlockingRuleIdsRef.delete(id)
      }
    })
}

function beforeRequestListener (requestDetails) {
  console.log('--- beforeRequestListener')
  console.log('cancel', requestDetails.url)
  console.log('')
  return {
    cancel: true
  }
}

function removeBeforeRequestListener () {
  chrome.webRequest.onBeforeRequest.removeListener(beforeRequestListener)
  console.log('--- removeBeforeRequestListener')
  console.log('')
}

function addBeforeRequestListener (requestFilter) {
  removeBeforeRequestListener()
  chrome.webRequest.onBeforeRequest.addListener(beforeRequestListener, requestFilter, _onBeforeRequestOptions)
  console.log('--- addBeforeRequestListener')
  console.log('requestFilter', requestFilter)
  console.log('')
}

function updateBeforeRequestListener (blockingRuleIds = new Set()) {
  const urls = []

  Array.from(blockingRuleIds).forEach((id) => {
    const rule = _blockingRules.find((item) => item.id === id)
    if (rule) {
      urls.push(...rule.urlFilters)
    }
  })

  console.log('--- updateBeforeRequestListener')
  console.log('rulesId', Array.from(blockingRuleIds))
  console.log('urls', urls)
  console.log('')

  if (urls.length > 0) {
    addBeforeRequestListener({ urls })
  } else {
    removeBeforeRequestListener()
  }
}

function messageListener (message, sender, sendResponse) {
  const { type, data } = message

  if (type === 'updateEnabledBlockingRuleIds') {
    const { enableRuleIds = [], disableRuleIds = [] } = data
    updateEnabledRulesetIds(_enabledBlockingRuleIds, {
      enableRuleIds,
      disableRuleIds
    })
    chrome.storage.sync.set({ enabledBlockingRuleIds: Array.from(_enabledBlockingRuleIds) })
    updateBeforeRequestListener(_enabledBlockingRuleIds)
  }
}

chrome.runtime.onMessage.addListener(messageListener)

chrome.storage.sync.get({ enabledBlockingRuleIds: [] }, ({ enabledBlockingRuleIds }) => {
  _enabledBlockingRuleIds.clear()

  if (Array.isArray(enabledBlockingRuleIds) && enabledBlockingRuleIds.length > 0) {
    enabledBlockingRuleIds.forEach((id) => {
      _enabledBlockingRuleIds.add(id)
    })
  }

  updateBeforeRequestListener(_enabledBlockingRuleIds)
})
