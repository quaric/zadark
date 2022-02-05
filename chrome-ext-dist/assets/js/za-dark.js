/*
  Za Dark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi
*/

document.body.classList.add("za-dark", "za-dark-chrome-ext");

chrome.storage.sync.get("theme", ({ theme }) => {
  _updateTheme(theme);
});
