/*
  Za Dark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi
*/

chrome.runtime.onInstalled.addListener(() => {
  const theme = 'dark'; // ['light', 'dark', 'system', 'auto']
  chrome.storage.sync.set({ theme });
});
