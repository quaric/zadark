/*
  Za Dark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi
*/

function _pad(n) {
  return n < 10 ? '0' + n : n;
}

function _getTimeNow() {
  const dt = new Date();
  const h = dt.getHours();
  const m = dt.getMinutes();
  return _pad(h) + ':' + _pad(m);
}

function _isInRange(value, range) {
  return value >= range[0] && value <= range[1];
}

function _setThemeAttribute(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function _mediaQueryListener(event) {
  chrome.storage.sync.get("theme", ({ theme }) => {
    if (theme === "system") {
      document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    }
  });
}

function _updateTheme(theme) {
  switch (theme) {
    case "system": {
      window.matchMedia("(prefers-color-scheme: dark)").addListener(_mediaQueryListener);
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      _setThemeAttribute(isDark);
      return;
    }

    case "auto": {
      const timeNow = _getTimeNow();
      const isDark = !_isInRange(timeNow, ['07:00', '18:00']);
      _setThemeAttribute(isDark);
      return;
    }

    case "light":
    case "dark": {
      const isDark = theme === 'dark';
      _setThemeAttribute(isDark);
      return;
    }

    default: {
      console.error('Unknown theme');
      return;
    }
  }
}
