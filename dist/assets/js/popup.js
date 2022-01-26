chrome.storage.sync.get("theme", ({ theme }) => {
  const isChecked = theme === 'dark';
  $('#checkbox-enable-dark-theme').prop('checked', isChecked);
});

function setPageTheme() {
  chrome.storage.sync.get("theme", ({ theme }) => {
    document.documentElement.setAttribute('data-theme', theme);
  });
}

async function updateTheme() {
  let tabs = await chrome.tabs.query({
    url: ["*://chat.zalo.me/*"],
    currentWindow: true,
    // active: true
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

$('#checkbox-enable-dark-theme').on('change', () => {
  const theme = $('#checkbox-enable-dark-theme').is(':checked') ? 'dark' : 'light';
  chrome.storage.sync.set({ theme });
  updateTheme();
});
