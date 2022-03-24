/*
  ZaDark – Best Dark Theme for Zalo
  Made by NCDAi Studio
*/

// This script helps to handle the "Sync with system" feature

function setThemeMode (isDark) {
  document.documentElement.setAttribute('data-theme-mode', isDark ? 'dark' : 'light')
}

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
setThemeMode(isDark)

window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
  setThemeMode(event.matches)
})
