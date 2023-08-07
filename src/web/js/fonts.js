(function (global) {
  function normalizeFontNameAndWeight (fontName, fontWeight) {
    const normalizedFontName = fontName.replace(/\s+/g, '+')
    const normalizedFontWeight = fontWeight.replace(/\s+/g, '')

    return `family=${normalizedFontName}:wght@${normalizedFontWeight}`
  }

  function normalizeFonts (fonts) {
    const normalizedFonts = fonts.map(font => {
      const [fontName, fontWeight] = font.trim().split(':')
      return normalizeFontNameAndWeight(fontName, fontWeight)
    })

    return normalizedFonts.join('&')
  }

  const ZaDarkFonts = {
    loadGoogleFonts: (fonts = [], classes = true) => {
      return new Promise((resolve, reject) => {
        if (classes) document.documentElement.classList.add('zdkf-loading')

        const googleFontsURL = `https://fonts.googleapis.com/css2?${normalizeFonts(fonts)}&display=swap`

        fetch(googleFontsURL, {
          method: 'GET',
          mode: 'no-cors'
        })
          .then((response) => response.text())
          .then((cssContent) => {
            const blob = new Blob([cssContent], { type: 'text/css' })
            const blobURL = URL.createObjectURL(blob)

            const linkTag = document.createElement('link')

            linkTag.rel = 'stylesheet'
            linkTag.href = blobURL

            linkTag.onload = () => {
              console.log('Google Fonts loaded', googleFontsURL)

              document.documentElement.classList.remove('zdkf-loading')
              document.documentElement.classList.add('zdkf-active')
              resolve()
            }

            linkTag.onerror = () => {
              throw new Error('Failed to load Google Fonts')
            }

            document.head.appendChild(linkTag)
          })
          .catch((error) => {
            document.documentElement.classList.remove('zdkf-loading')
            reject(new Error('Error: ' + error.message))
          })
      })
    }
  }

  global.ZaDarkFonts = ZaDarkFonts
})(this)
