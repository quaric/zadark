(function (global) {
  const debounce = (func, delay) => {
    let timer
    return () => {
      clearTimeout(timer)
      timer = setTimeout(func, delay)
    }
  }

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = function (event) {
        const img = new Image()
        img.src = event.target.result

        img.onload = function () {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_HEIGHT = 1920
          const scale = MAX_HEIGHT / img.height
          const newWidth = img.width * scale

          canvas.width = newWidth
          canvas.height = MAX_HEIGHT

          ctx.drawImage(img, 0, 0, newWidth, MAX_HEIGHT)

          const imageBase64 = canvas.toDataURL('image/jpeg', 1)
          resolve(imageBase64)
        }

        img.onerror = function () {
          reject(new Error('Không thể tải ảnh'))
        }
      }

      reader.readAsDataURL(file)
    })
  }

  const convertBase64ToBlob = (base64) => {
    const mime = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)[1]

    const byteString = window.atob(base64.split(',')[1])
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; ++i) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    return new Blob([uint8Array], { type: mime })
  }

  global.ZaDarkShared = {
    debounce,
    convertImageToBase64,
    convertBase64ToBlob
  }
})(this)
