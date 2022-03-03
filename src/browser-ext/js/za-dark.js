/*
  ZaDark – Best Dark Theme for Zalo
  Browser Extension
  Made by NCDAi Studio
*/

document.getElementsByTagName('head')[0].insertAdjacentHTML(
  'beforeend',
  '<style id="za-dark-font">@import url(\'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap\');</style>'
)

window.zadark.browser.initClassNames()
window.zadark.utils.refreshPageTheme()
