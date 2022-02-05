/*
  Za Dark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi
*/

const selectThemeElName = '#select-theme input:radio[name="theme"]';

chrome.storage.sync.get("theme", ({ theme }) => {
  _updateTheme(theme);
  $(selectThemeElName).filter(`[value="${theme}"]`).attr('checked', true);
});

function setPageTheme() {
  chrome.storage.sync.get("theme", ({ theme }) => {
    _updateTheme(theme);
  });
}

async function updateTabs() {
  const tabs = await chrome.tabs.query({
    url: ["*://chat.zalo.me/*"],
    currentWindow: true
  });

  const hasResult = Array.isArray(tabs) && tabs.length > 0;

  if (!hasResult) {
    return;
  }

  tabs.forEach((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageTheme
    });
  });
}

$(selectThemeElName).on('change', function (item) {
  const theme = $(this).val();
  chrome.storage.sync.set({ theme });
  updateTabs();
  _updateTheme(theme);
});
