/*
  ZaDark – Best Dark Theme for Zalo
  Chrome Extension
  Made by NCDAi Studio
*/

document.getElementsByTagName('head')[0].insertAdjacentHTML(
  'beforeend',
  `<style id="za-dark-font">@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap');</style>`
);

document.body.classList.add("za-dark", "za-dark-chrome-ext");

_getExtensionSettings().then(({ themeMode, userTheme, darkTheme }) => {
  _updateTheme({
    themeMode,
    userTheme,
    darkTheme
  });
});
