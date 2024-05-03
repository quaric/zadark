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

          const MAX_HEIGHT = 1920
          const scale = MAX_HEIGHT / img.height
          const newWidth = img.width * scale

          canvas.width = newWidth
          canvas.height = MAX_HEIGHT

          ctx.drawImage(img, 0, 0, newWidth, MAX_HEIGHT)

          const imageBase64 = canvas.toDataURL('image/jpg', 1)
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
