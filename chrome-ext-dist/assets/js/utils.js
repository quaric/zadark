/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

function _getExtensionSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({
      themeMode: "single",
      userTheme: "dark_dimmed",
      darkTheme: "dark_dimmed"
    }, (items) => {
      resolve(items);
    });
  });
}

function _setThemeModeAttribute(themeMode) {
  document.documentElement.setAttribute("data-theme-mode", themeMode);
}

function _setDarkThemeAttribute(themeMode) {
  document.documentElement.setAttribute("data-dark-theme", themeMode);
}

function _setLightThemeAttribute(themeMode) {
  document.documentElement.setAttribute("data-light-theme", themeMode);
}

function _mediaQueryListener(event) {
  _getExtensionSettings().then(({ themeMode }) => {
    if (themeMode === "auto") {
      _setThemeModeAttribute(event.matches ? "dark" : "light");
    }
  });
}

function _updateTheme({ themeMode, userTheme, darkTheme }) {
  if (themeMode === "single") {
    if (["dark", "dark_dimmed"].includes(userTheme)) {
      _setThemeModeAttribute("dark");
      _setDarkThemeAttribute(userTheme);
    } else {
      _setThemeModeAttribute("light");
      _setLightThemeAttribute(userTheme);
    }
  }

  if (themeMode === "auto") {
    window.matchMedia("(prefers-color-scheme: dark)").addListener(_mediaQueryListener);

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    _setThemeModeAttribute(isDark ? "dark" : "light");
    _setDarkThemeAttribute(darkTheme);
  }
}
