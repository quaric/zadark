(function (global) {
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = function (event) {
        const img = new Image()
        img.src = event.target.result

        img.onload = function () {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_WIDTH = 720
          const scale = MAX_WIDTH / img.width
          const newHeight = img.height * scale

          canvas.width = MAX_WIDTH
          canvas.height = newHeight

          ctx.drawImage(img, 0, 0, MAX_WIDTH, newHeight)

          const imageBase64 = canvas.toDataURL('image/webp', 0.8)
          resolve(imageBase64)
        }

        img.onerror = function () {
          reject(new Error('Không thể tải ảnh'))
        }
      }

      reader.readAsDataURL(file)
    })
  }

  global.ZaDarkShared = {
    convertImageToBase64
  }
})(this)
