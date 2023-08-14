/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

if (typeof require === 'function') {
  window.WebFont = require('./zadark-webfont.min.js')
}

document.documentElement.setAttribute('data-zadark-theme', 'dark')

WebFont.load({
  google: {
    families: ['Open Sans:400,500,600:latin,vietnamese']
  },
  timeout: 1408
})
