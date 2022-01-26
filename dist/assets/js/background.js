chrome.runtime.onInstalled.addListener(() => {
  const theme = 'dark';
  chrome.storage.sync.set({ theme });
  console.log(`Default theme set to ${theme}`);
});
