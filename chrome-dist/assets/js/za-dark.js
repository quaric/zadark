/*
  Za Dark – Best Dark Theme for Zalo Web
  Made by NCDAi
  Version 2.0
*/

console.log('\n');
console.log('Za Dark – Best Dark Theme for Zalo Web');
console.log('Made by NCDAi');
console.log('\n');

document.body.classList.add("za-dark", "za-dark-chrome-extension");

chrome.storage.sync.get("theme", ({ theme }) => {
  _updateTheme(theme);
});
