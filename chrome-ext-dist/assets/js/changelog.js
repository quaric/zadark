/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

const manifestData = chrome.runtime.getManifest();
$("#ext-version1, #ext-version2").html(`v${manifestData.version}`);

$("#ext-links-home").on("click", function () {
  chrome.tabs.create({ url: "views/welcome.html" });
});

_getExtensionSettings().then(({ themeMode, userTheme, darkTheme }) => {
  _updateTheme({
    themeMode,
    userTheme,
    darkTheme
  });
});
