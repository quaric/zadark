(function ($) {
  const translate = async (text, target) => {
    try {
      const res = await fetch(ZADARK_API_URL + '/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          target
        })
      })
      const json = await res.json()
      return json
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  $.fn.zadarkTranslateMessage = function (getTargetLanguage) {
    return this.each(function () {
      $(this).on('mouseenter', '.card.card--text', function (e) {
        const cardEl = $(this)

        if (cardEl.find('.zadark-translate__button').length) {
          return
        }

        const textEl = cardEl.find('div > span-15')
        const text = textEl ? textEl.text().replace(/(?:\r\n|\r|\n)/g, '<br>') : ''

        const buttonEl = $('<button>')
          .addClass('zadark-translate__button')
          .html('<i class="zadark-icon zadark-icon--translate"></i>')

        buttonEl.on('click', function (e) {
          e.preventDefault()
          e.stopPropagation()

          const prevTranslateEl = cardEl.find('.zadark-translate__content')

          if (prevTranslateEl.length) {
            prevTranslateEl.remove()
            return
          }

          if (!text) {
            return
          }

          const translateTarget = typeof getTargetLanguage === 'function' ? getTargetLanguage() : 'vi'

          if (!translateTarget) {
            return
          }

          const nextTranslationEl = $('<div>')
            .addClass('zadark-translate__content')
            .html(`
              <div class="zadark-translate__content__title">
                <i class="zadark-icon zadark-icon--translate"></i>
                Đang dịch ...
              </div>
            `)

          cardEl.append(nextTranslationEl)

          translate(text, translateTarget).then((res) => {
            if (!res.success) {
              nextTranslationEl
                .addClass('zadark-translate__content--error')
                .html('Lỗi: ' + res.message)
              return
            }

            nextTranslationEl
              .html(`
                <div class="zadark-translate__content__title">
                  <i class="zadark-icon zadark-icon--translate"></i>
                  ${res.languageName}
                </div>
                <div>${res.translation}</div>
              `)
          })
        })

        cardEl.append(buttonEl)
      })
    })
  }

  const LANGUAGES = [
    {
      code: 'ar',
      name: 'Ả Rập'
    },
    {
      code: 'sq',
      name: 'Albania'
    },
    {
      code: 'am',
      name: 'Amharic'
    },
    {
      code: 'en',
      name: 'Anh'
    },
    {
      code: 'hy',
      name: 'Armenia'
    },
    {
      code: 'as',
      name: 'Assam'
    },
    {
      code: 'ay',
      name: 'Aymara'
    },
    {
      code: 'az',
      name: 'Azerbaijan'
    },
    {
      code: 'pl',
      name: 'Ba Lan'
    },
    {
      code: 'fa',
      name: 'Ba Tư'
    },
    {
      code: 'bm',
      name: 'Bambara'
    },
    {
      code: 'xh',
      name: 'Bantu'
    },
    {
      code: 'eu',
      name: 'Basque'
    },
    {
      code: 'nso',
      name: 'Bắc Sotho'
    },
    {
      code: 'be',
      name: 'Belarus'
    },
    {
      code: 'bn',
      name: 'Bengal'
    },
    {
      code: 'bho',
      name: 'Bhojpuri'
    },
    {
      code: 'bs',
      name: 'Bosnia'
    },
    {
      code: 'pt',
      name: 'Bồ Đào Nha'
    },
    {
      code: 'bg',
      name: 'Bulgaria'
    },
    {
      code: 'ca',
      name: 'Catalan'
    },
    {
      code: 'ceb',
      name: 'Cebuano'
    },
    {
      code: 'ny',
      name: 'Chichewa'
    },
    {
      code: 'co',
      name: 'Corsi'
    },
    {
      code: 'ht',
      name: 'Creole (Haiti)'
    },
    {
      code: 'hr',
      name: 'Croatia'
    },
    {
      code: 'dv',
      name: 'Divehi'
    },
    {
      code: 'iw',
      name: 'Do Thái'
    },
    {
      code: 'doi',
      name: 'Dogri'
    },
    {
      code: 'da',
      name: 'Đan Mạch'
    },
    {
      code: 'de',
      name: 'Đức'
    },
    {
      code: 'et',
      name: 'Estonia'
    },
    {
      code: 'ee',
      name: 'Ewe'
    },
    {
      code: 'tl',
      name: 'Filipino'
    },
    {
      code: 'fy',
      name: 'Frisia'
    },
    {
      code: 'gd',
      name: 'Gael Scotland'
    },
    {
      code: 'gl',
      name: 'Galicia'
    },
    {
      code: 'ka',
      name: 'George'
    },
    {
      code: 'gn',
      name: 'Guarani'
    },
    {
      code: 'gu',
      name: 'Gujarat'
    },
    {
      code: 'nl',
      name: 'Hà Lan'
    },
    {
      code: 'af',
      name: 'Hà Lan (Nam Phi)'
    },
    {
      code: 'ko',
      name: 'Hàn'
    },
    {
      code: 'ha',
      name: 'Hausa'
    },
    {
      code: 'haw',
      name: 'Hawaii'
    },
    {
      code: 'hi',
      name: 'Hindi'
    },
    {
      code: 'hmn',
      name: 'Hmong'
    },
    {
      code: 'hu',
      name: 'Hungary'
    },
    {
      code: 'el',
      name: 'Hy Lạp'
    },
    {
      code: 'is',
      name: 'Iceland'
    },
    {
      code: 'ig',
      name: 'Igbo'
    },
    {
      code: 'ilo',
      name: 'Iloko'
    },
    {
      code: 'id',
      name: 'Indonesia'
    },
    {
      code: 'ga',
      name: 'Ireland'
    },
    {
      code: 'jw',
      name: 'Java'
    },
    {
      code: 'kn',
      name: 'Kannada'
    },
    {
      code: 'kk',
      name: 'Kazakh'
    },
    {
      code: 'km',
      name: 'Khmer'
    },
    {
      code: 'rw',
      name: 'Kinyarwanda'
    },
    {
      code: 'gom',
      name: 'Konkani'
    },
    {
      code: 'kri',
      name: 'Krio'
    },
    {
      code: 'ku',
      name: 'Kurd (Kurmanji)'
    },
    {
      code: 'ckb',
      name: 'Kurd (Sorani)'
    },
    {
      code: 'ky',
      name: 'Kyrgyz'
    },
    {
      code: 'lo',
      name: 'Lào'
    },
    {
      code: 'la',
      name: 'Latinh'
    },
    {
      code: 'lv',
      name: 'Latvia'
    },
    {
      code: 'ln',
      name: 'Lingala'
    },
    {
      code: 'lt',
      name: 'Litva'
    },
    {
      code: 'lb',
      name: 'Luxembourg'
    },
    {
      code: 'ms',
      name: 'Mã Lai'
    },
    {
      code: 'mk',
      name: 'Macedonia'
    },
    {
      code: 'mai',
      name: 'Maithili'
    },
    {
      code: 'mg',
      name: 'Malagasy'
    },
    {
      code: 'ml',
      name: 'Malayalam'
    },
    {
      code: 'mt',
      name: 'Malta'
    },
    {
      code: 'mi',
      name: 'Maori'
    },
    {
      code: 'mr',
      name: 'Marathi'
    },
    {
      code: 'mni-Mtei',
      name: 'Meiteilon (Manipuri)'
    },
    {
      code: 'lus',
      name: 'Mizo'
    },
    {
      code: 'mn',
      name: 'Mông Cổ'
    },
    {
      code: 'my',
      name: 'Myanmar'
    },
    {
      code: 'no',
      name: 'Na Uy'
    },
    {
      code: 'ne',
      name: 'Nepal'
    },
    {
      code: 'ru',
      name: 'Nga'
    },
    {
      code: 'ja',
      name: 'Nhật'
    },
    {
      code: 'or',
      name: 'Odia (Oriya)'
    },
    {
      code: 'om',
      name: 'Oromo'
    },
    {
      code: 'ps',
      name: 'Pashto'
    },
    {
      code: 'sa',
      name: 'Phạn'
    },
    {
      code: 'fr',
      name: 'Pháp'
    },
    {
      code: 'fi',
      name: 'Phần Lan'
    },
    {
      code: 'pa',
      name: 'Punjab'
    },
    {
      code: 'qu',
      name: 'Quechua'
    },
    {
      code: 'eo',
      name: 'Quốc tế ngữ'
    },
    {
      code: 'ro',
      name: 'Rumani'
    },
    {
      code: 'sm',
      name: 'Samoa'
    },
    {
      code: 'cs',
      name: 'Séc'
    },
    {
      code: 'sr',
      name: 'Serbia'
    },
    {
      code: 'st',
      name: 'Sesotho'
    },
    {
      code: 'sn',
      name: 'Shona'
    },
    {
      code: 'sd',
      name: 'Sindhi'
    },
    {
      code: 'si',
      name: 'Sinhala'
    },
    {
      code: 'sk',
      name: 'Slovak'
    },
    {
      code: 'sl',
      name: 'Slovenia'
    },
    {
      code: 'so',
      name: 'Somali'
    },
    {
      code: 'su',
      name: 'Sunda'
    },
    {
      code: 'sw',
      name: 'Swahili'
    },
    {
      code: 'tg',
      name: 'Tajik'
    },
    {
      code: 'ta',
      name: 'Tamil'
    },
    {
      code: 'tt',
      name: 'Tatar'
    },
    {
      code: 'es',
      name: 'Tây Ban Nha'
    },
    {
      code: 'te',
      name: 'Telugu'
    },
    {
      code: 'th',
      name: 'Thái'
    },
    {
      code: 'tr',
      name: 'Thổ Nhĩ Kỳ'
    },
    {
      code: 'sv',
      name: 'Thụy Điển'
    },
    {
      code: 'lg',
      name: 'Tiếng Ganda'
    },
    {
      code: 'ti',
      name: 'Tigrinya'
    },
    {
      code: 'zh',
      name: 'Trung (Giản thể)'
    },
    {
      code: 'zh-TW',
      name: 'Trung (Phồn thể)'
    },
    {
      code: 'ts',
      name: 'Tsonga'
    },
    {
      code: 'tk',
      name: 'Turkmen'
    },
    {
      code: 'ak',
      name: 'Twi'
    },
    {
      code: 'uk',
      name: 'Ukraina'
    },
    {
      code: 'ur',
      name: 'Urdu'
    },
    {
      code: 'ug',
      name: 'Uyghur'
    },
    {
      code: 'uz',
      name: 'Uzbek'
    },
    {
      code: 'vi',
      name: 'Việt'
    },
    {
      code: 'cy',
      name: 'Xứ Wales'
    },
    {
      code: 'it',
      name: 'Ý'
    },
    {
      code: 'yi',
      name: 'Yiddish'
    },
    {
      code: 'yo',
      name: 'Yoruba'
    },
    {
      code: 'zu',
      name: 'Zulu'
    },
    {
      code: 'he',
      name: 'Do Thái'
    },
    {
      code: 'jv',
      name: 'Java'
    },
    {
      code: 'zh-CN',
      name: 'Trung (Giản thể)'
    }
  ]

  $.fn.setLanguagesOptions = function (defaultLanguage = 'vi') {
    return this.each(function () {
      const selectElement = $(this)

      selectElement.empty()

      selectElement.append($('<option>').val('none').text('Tắt'))

      LANGUAGES.forEach(function (language) {
        const option = $('<option>').val(language.code).text(`Tiếng ${language.name}`)
        selectElement.append(option)
      })

      selectElement.val(defaultLanguage)
    })
  }
})(jQuery)
