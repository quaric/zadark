/*
  ZaDark – Zalo Dark Mode
  Made by Quaric

  This script helps to handle the "Sync with system" feature
*/

function setThemeMode (isDark) {
  document.documentElement.setAttribute('data-zadark-theme', isDark ? 'dark' : 'light')
}

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
setThemeMode(isDark)

window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
  setThemeMode(event.matches)
})
