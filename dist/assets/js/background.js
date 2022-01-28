/*
  Za Dark – Best Dark Theme for Zalo Web
  Made by NCDAi
  Version 2.0
*/

chrome.runtime.onInstalled.addListener(() => {
  const theme = 'dark'; // ['light', 'dark', 'system', 'auto']
  chrome.storage.sync.set({ theme });
});
