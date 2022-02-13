/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

const selectThemeModeElName = "#select-theme-mode";
const selectUserThemeElName = '#select-user-theme input:radio[name="user_theme"]';
const selectDarkThemeElName = '#select-dark-theme input:radio[name="dark_theme"]';

const themeModeSingleElName = "#theme-mode-single";
const themeModeAutoElName = "#theme-mode-auto";

const themeModeSingleDescElName = '.theme-mode-description[data-theme-mode="single"]';
const themeModeAutoDescElName = '.theme-mode-description[data-theme-mode="auto"]';

const manifestData = chrome.runtime.getManifest();
$("#ext-version").html(`Version ${manifestData.version}`);

function updateThemeMode(themeMode) {
  $(themeModeSingleElName).hide();
  $(themeModeAutoElName).hide();

  $(themeModeSingleDescElName).hide();
  $(themeModeAutoDescElName).hide();

  if (themeMode === "single") {
    $(themeModeSingleElName).show();
    $(themeModeSingleDescElName).show();
  } else {
    $(themeModeAutoElName).show();
    $(themeModeAutoDescElName).show();
  }
}

_getExtensionSettings().then(({ themeMode, userTheme, darkTheme }) => {
  updateThemeMode(themeMode);

  $(selectThemeModeElName).val(themeMode);
  $(selectUserThemeElName).filter(`[value="${userTheme}"]`).attr("checked", true);
  $(selectDarkThemeElName).filter(`[value="${darkTheme}"]`).attr("checked", true);

  _updateTheme({
    themeMode,
    userTheme,
    darkTheme
  });
});

function setPageTheme() {
  _getExtensionSettings().then(({ themeMode, userTheme, darkTheme }) => {
    _updateTheme({
      themeMode,
      userTheme,
      darkTheme
    });
  });
}

async function setPageThemeForAllZaloTabs() {
  // Get all Zalo tabs
  const tabs = await chrome.tabs.query({
    url: ["*://chat.zalo.me/*"],
    currentWindow: true
  });

  const hasResult = Array.isArray(tabs) && tabs.length > 0;

  if (!hasResult) {
    return;
  }

  // Set page theme for all Zalo tabs
  tabs.forEach((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageTheme
    });
  });
}

function fireThemeSettingsChanged() {
  // Set page theme for all Zalo tabs
  setPageThemeForAllZaloTabs();

  // Set popup theme
  setPageTheme();
}

$(selectThemeModeElName).on("change", function () {
  const themeMode = $(this).val();
  chrome.storage.sync.set({ themeMode });
  updateThemeMode(themeMode);
  fireThemeSettingsChanged();
});

$(selectUserThemeElName).on("change", function () {
  const userTheme = $(this).val();
  chrome.storage.sync.set({ userTheme });
  fireThemeSettingsChanged();
});

$(selectDarkThemeElName).on("change", function () {
  const darkTheme = $(this).val();
  chrome.storage.sync.set({ darkTheme });
  fireThemeSettingsChanged();
});

$("#ext-links-home").on("click", function () {
  chrome.tabs.create({ url: "views/welcome.html" });
});

$("#ext-version").on("click", function () {
  chrome.tabs.create({ url: "views/changelog.html" });
});
