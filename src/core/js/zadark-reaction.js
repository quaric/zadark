(function () {
  const log = console.log.bind(console, '[zadark-reaction]')

  // Copied from assets/zalo-reactions-emoji-pos.json
  const EMOJI_POS = {
    ':)': '82.00% 17.50%',
    ':~': '84.00% 37.50%',
    ':b': '82.00% 30.00%',
    ":')": '82.00% 05.00%',
    '8-)': '82.00% 45.00%',
    ':-((': '84.00% 02.50%',
    ':$': '82.00% 20.00%',
    ':3': '82.00% 37.50%',
    ':z': '84.00% 50.00%',
    ':((': '82.00% 95.00%',
    '&-(': '84.00% 35.00%',
    ':-h': '84.00% 05.00%',
    ':p': '82.00% 40.00%',
    ':d': '82.00% 00.00%',
    ':o': '84.00% 20.00%',
    ':(': '82.00% 85.00%',
    ';-)': '82.00% 50.00%',
    '--b': '84.00% 30.00%',
    ':))': '82.00% 10.00%',
    ':-*': '82.00% 32.50%',
    ';p': '82.00% 22.50%',
    ';-d': '82.00% 27.50%',
    ';d': '82.00% 60.00%',
    ';o': '82.00% 87.50%',
    ';g': '82.00% 42.50%',
    '|-)': '84.00% 45.00%',
    ':!': '84.00% 00.00%',
    ':l': '82.00% 70.00%',
    ':>': '82.00% 07.50%',
    ':;': '82.00% 47.50%',
    ';f': '82.00% 57.50%',
    ':v': '82.00% 55.00%',
    ':wipe': '84.00% 32.50%',
    ':-dig': '82.00% 80.00%',
    ':handclap': '82.00% 77.50%',
    'b-)': '82.00% 02.50%',
    ':-r': '82.00% 72.50%',
    ':-<': '82.00% 65.00%',
    ':-o': '84.00% 47.50%',
    ';-s': '84.00% 07.50%',
    ';?': '84.00% 17.50%',
    ';-x': '82.00% 75.00%',
    ':-f': '84.00% 40.00%',
    ';!': '82.00% 100.00%',
    ';xx': '84.00% 12.50%',
    ':-bye': '82.00% 12.50%',
    '>-|': '82.00% 82.50%',
    'p-(': '82.00% 90.00%',
    ':--|': '82.00% 92.50%',
    ':q': '84.00% 10.00%',
    'x-)': '82.00% 52.50%',
    ':*': '82.00% 35.00%',
    ';-a': '84.00% 22.50%',
    '8*': '82.00% 97.50%',
    ':|': '82.00% 67.50%',
    ':x': '84.00% 27.50%',
    ':t': '84.00% 42.50%',
    ';-/': '84.00% 15.00%',
    ':-l': '82.00% 62.50%',
    '$-)': '82.00% 15.00%',
    '/-rose': '84.00% 60.00%',
    '/-fade': '84.00% 62.50%',
    '/-bd': '84.00% 65.00%',
    '/-bome': '84.00% 67.50%',
    '/-heart': '84.00% 72.50%',
    '/-break': '84.00% 75.00%',
    '/-shit': '84.00% 77.50%',
    '/-li': '84.00% 80.00%',
    '/-strong': '84.00% 82.50%',
    '/-weak': '84.00% 85.00%',
    '/-ok': '84.00% 87.50%',
    '/-v': '84.00% 90.00%',
    '/-thanks': '84.00% 92.50%',
    '/-punch': '84.00% 95.00%',
    '/-share': '84.00% 97.50%',
    '_()_': '84.00% 100.00%',
    '/-no': '86.00% 00.00%',
    '/-bad': '86.00% 02.50%',
    '/-loveu': '86.00% 05.00%',
    ':christmas_tree:': '16.00% 70.00%',
    ':snowman:': '02.00% 07.50%',
    ':gift:': '16.00% 62.50%'
  }

  const EMOJI_POS_MAP = new Map(Object.entries(EMOJI_POS))

  /**
   * @typedef {Object} Emoji
   * @property {number} rType - The type of the emoji (e.g. 0 for default).
   * @property {string} rIcon - The textual representation of the emoji.
   * @property {string} backgroundPosition - The CSS background-position for sprite sheets.
   */

  /** @type {Emoji[]} */
  const EMOJI_LIST = [
    {
      rType: 0,
      rIcon: ':>'
    },
    {
      rType: 1,
      rIcon: '--b'
    },
    {
      rType: 2,
      rIcon: ':-(('
    },
    {
      rType: 3,
      rIcon: '/-strong'
    },
    {
      rType: 4,
      rIcon: '/-weak'
    },
    {
      rType: 5,
      rIcon: '/-heart'
    },
    {
      rType: 6,
      rIcon: ':d'
    },
    {
      rType: 7,
      rIcon: ":')"
    },
    {
      rType: 8,
      rIcon: ':-*'
    },
    {
      rType: 9,
      rIcon: ':3'
    },
    {
      rType: 10,
      rIcon: ':b'
    },
    {
      rType: 11,
      rIcon: ';d'
    },
    {
      rType: 12,
      rIcon: ':~'
    },
    {
      rType: 13,
      rIcon: ';p'
    },
    {
      rType: 14,
      rIcon: ':*'
    },
    {
      rType: 15,
      rIcon: ';o'
    },
    {
      rType: 16,
      rIcon: ':(('
    },
    {
      rType: 17,
      rIcon: ':)'
    },
    {
      rType: 18,
      rIcon: ':p'
    },
    {
      rType: 19,
      rIcon: ':$'
    },
    {
      rType: 20,
      rIcon: ':-h'
    },
    {
      rType: 21,
      rIcon: 'x-)'
    },
    {
      rType: 22,
      rIcon: '8-)'
    },
    {
      rType: 23,
      rIcon: ';-d'
    },
    {
      rType: 24,
      rIcon: ':q'
    },
    {
      rType: 25,
      rIcon: ':('
    },
    {
      rType: 26,
      rIcon: 'b-)'
    },
    {
      rType: 27,
      rIcon: ';?'
    },
    {
      rType: 28,
      rIcon: ':|'
    },
    {
      rType: 29,
      rIcon: ';xx'
    },
    {
      rType: 30,
      rIcon: ':--|'
    },
    {
      rType: 31,
      rIcon: ';g'
    },
    {
      rType: 32,
      rIcon: ':o'
    },
    {
      rType: 33,
      rIcon: ':z'
    },
    {
      rType: 34,
      rIcon: ':l'
    },
    {
      rType: 35,
      rIcon: 'p-('
    },
    {
      rType: 36,
      rIcon: ':-bye'
    },
    {
      rType: 37,
      rIcon: ':x'
    },
    {
      rType: 38,
      rIcon: '|-)'
    },
    {
      rType: 39,
      rIcon: ':wipe'
    },
    {
      rType: 40,
      rIcon: ':!'
    },
    {
      rType: 41,
      rIcon: '8*'
    },
    {
      rType: 42,
      rIcon: ':-dig'
    },
    {
      rType: 43,
      rIcon: ':t'
    },
    {
      rType: 44,
      rIcon: '&-('
    },
    {
      rType: 45,
      rIcon: ';-)'
    },
    {
      rType: 46,
      rIcon: ':handclap'
    },
    {
      rType: 47,
      rIcon: '>-|'
    },
    {
      rType: 48,
      rIcon: ':-f'
    },
    {
      rType: 49,
      rIcon: ':-l'
    },
    {
      rType: 50,
      rIcon: ':-r'
    },
    {
      rType: 51,
      rIcon: ';-/'
    },
    {
      rType: 52,
      rIcon: ';-x'
    },
    {
      rType: 53,
      rIcon: ':-o'
    },
    {
      rType: 54,
      rIcon: ';-s'
    },
    {
      rType: 56,
      rIcon: ';!'
    },
    {
      rType: 57,
      rIcon: ';f'
    },
    {
      rType: 58,
      rIcon: ':;'
    },
    {
      rType: 59,
      rIcon: ':v'
    },
    {
      rType: 60,
      rIcon: ';-a'
    },
    {
      rType: 61,
      rIcon: ':-<'
    },
    {
      rType: 62,
      rIcon: ':))'
    },
    {
      rType: 63,
      rIcon: '$-)'
    },
    {
      rType: 65,
      rIcon: '/-break'
    },
    {
      rType: 66,
      rIcon: '/-shit'
    },
    {
      rType: 67,
      rIcon: '/-li'
    },
    {
      rType: 68,
      rIcon: '/-ok'
    },
    {
      rType: 69,
      rIcon: '/-v'
    },
    {
      rType: 70,
      rIcon: '/-thanks'
    },
    {
      rType: 71,
      rIcon: '/-punch'
    },
    {
      rType: 72,
      rIcon: '/-share'
    },
    {
      rType: 73,
      rIcon: '_()_'
    },
    {
      rType: 84,
      rIcon: ':christmas_tree:'
    },
    {
      rType: 86,
      rIcon: ':snowman:'
    },
    {
      rType: 95,
      rIcon: ':gift:'
    },
    {
      rType: 120,
      rIcon: '/-rose'
    },
    {
      rType: 121,
      rIcon: '/-fade'
    },
    {
      rType: 126,
      rIcon: '/-bd'
    },
    {
      rType: 127,
      rIcon: '/-bome'
    },
    {
      rType: 131,
      rIcon: '/-no'
    },
    {
      rType: 132,
      rIcon: '/-bad'
    },
    {
      rType: 133,
      rIcon: '/-loveu'
    }
  ].map((emoji) => ({
    ...emoji,
    backgroundPosition: EMOJI_POS_MAP.get(emoji.rIcon) || '0% 0%'
  }))

  /**
   * Retrieves the internal React Fiber node from a given DOM element.
   *
   * @param {HTMLElement} el - The DOM element to inspect.
   * @returns {Object|null} - The corresponding React Fiber node if found, otherwise null.
   */
  const getReactFiber = (el) => {
    for (const k in el) {
      if (k.startsWith('__reactInternalInstance')) {
        return el[k]
      }
    }
    return null
  }

  const RECENT_EMOJI_LIST_KEY = 'zadark/reaction-recent-emojis'

  /**
   * Saves the list of recently used emojis to localStorage.
   *
   * @param {Emoji[]} emojis - An array of emoji objects to be saved.
   */
  const saveRecentEmojis = (emojis) => {
    try {
      localStorage.setItem(RECENT_EMOJI_LIST_KEY, JSON.stringify(emojis))
    } catch (e) {
      log('Failed to save recent emojis to localStorage', e)
    }
  }

  /**
   * Adds a new emoji to the recent emoji list.
   * If the emoji already exists, it is moved to the top of the list.
   * The list is trimmed to a maximum of 5 emojis.
   *
   * @param {Emoji} emoji - The emoji object to be added.
   */
  const addRecentEmoji = (emoji) => {
    const existingIndex = RECENT_EMOJI_LIST.findIndex(e => e.rIcon === emoji.rIcon)

    if (existingIndex !== -1) {
      RECENT_EMOJI_LIST.splice(existingIndex, 1)
    }

    RECENT_EMOJI_LIST.unshift(emoji)

    if (RECENT_EMOJI_LIST.length > 5) {
      RECENT_EMOJI_LIST.length = 5
    }

    saveRecentEmojis(RECENT_EMOJI_LIST)
  }

  /**
   * Cleans a list of emojis by filtering out those not found in the global EMOJI_LIST.
   *
   * @param {Emoji[]} emojis - An optional array of emoji objects to clean.
   * @returns {Emoji[]} A filtered and validated list of emoji objects.
   */
  const cleanEmojis = (emojis) => {
    if (!Array.isArray(emojis)) {
      return []
    }

    if (emojis.length === 0) {
      return []
    }

    const emojiListMap = new Map(EMOJI_LIST.map((e) => [e.rIcon, e]))
    return emojis.map((e) => emojiListMap.get(e.rIcon)).filter(Boolean)
  }

  /**
   * Retrieves the list of recently used emojis from localStorage.
   * Returns a cleaned list with only valid emojis based on EMOJI_LIST.
   *
   * @returns {Emoji[]} An array of recently used emoji objects.
   */
  const getRecentEmojis = () => {
    const recentEmojis = localStorage.getItem(RECENT_EMOJI_LIST_KEY)

    if (!recentEmojis) {
      return []
    }

    try {
      return cleanEmojis(JSON.parse(recentEmojis))
    } catch (e) {
      log('Failed to parse recent emojis from localStorage', e)
      return []
    }
  }

  const RECENT_EMOJI_LIST = getRecentEmojis()

  /**
   * A cache map for storing previously created emoji elements,
   * keyed by a combination of emoji type and icon.
   */
  const emojiCache = new Map()

  /**
   * Creates a new emoji DOM element, or reuses one from cache if available.
   * Adds necessary styling and click behavior.
   *
   * @param {Emoji} emoji - Contains properties like rType, rIcon, and backgroundPosition.
   * @param {Function} sendReaction - Callback triggered when the emoji is clicked.
   * @param {Function} closePopover - Callback to close the emoji selection UI.
   * @returns {HTMLElement} - A fully prepared DOM element representing the emoji.
   */
  const createEmojiEl = (emoji, sendReaction, closePopover) => {
    const cacheKey = `${emoji.rType}:${emoji.rIcon}`

    if (emojiCache.has(cacheKey)) {
      // log('using cached emoji', cacheKey)

      const cachedEl = emojiCache.get(cacheKey).cloneNode(true)
      attachClickHandler(cachedEl, emoji, sendReaction, closePopover)

      return cachedEl
    }

    // log('creating new emoji', cacheKey)

    const emojiUrl = document.documentElement.getAttribute('data-zadark-emoji-url')

    const wrapperEl = document.createElement('div')
    wrapperEl.className = 'zadark-reaction__emoji'

    const emojiEl = document.createElement('span')
    emojiEl.className = 'emoji-sizer emoji-outer'
    emojiEl.style.backgroundSize = '5100%'
    emojiEl.style.backgroundRepeat = 'no-repeat'
    emojiEl.style.webkitUserDrag = 'none'
    emojiEl.style.backgroundImage = `url("${emojiUrl}?v=250409")`
    emojiEl.style.backgroundPosition = emoji.backgroundPosition
    emojiEl.style.margin = '-1px'

    wrapperEl.appendChild(emojiEl)

    emojiCache.set(cacheKey, wrapperEl.cloneNode(true))
    attachClickHandler(wrapperEl, emoji, sendReaction, closePopover)

    return wrapperEl
  }

  /**
   * Attaches a click event handler to an emoji element that:
   * - Prevents default behavior and stops event propagation.
   * - Invokes the sendReaction callback with emoji data if provided.
   * - Closes the emoji popover if the closePopover callback is defined.
   *
   * @param {HTMLElement} el - The target element to bind the event to.
   * @param {Emoji} emoji - Contains rType and rIcon for reaction payload.
   * @param {Function} sendReaction - Function to handle the emoji click action.
   * @param {Function} closePopover - Function to close the emoji popover UI.
   */
  const attachClickHandler = (el, emoji, sendReaction, closePopover) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (typeof sendReaction === 'function') {
        sendReaction({
          rType: emoji.rType,
          rIcon: emoji.rIcon
        })
        addRecentEmoji(emoji)
      }

      if (typeof closePopover === 'function') {
        closePopover()
      }
    })
  }

  /**
   * Traverses up the React Fiber tree starting from a given DOM element,
   * looking for a fiber node that contains a `sendReaction` function in its props.
   *
   * @param {HTMLElement} el - The DOM element to begin traversal from.
   * @param {number} [maxDepth=10] - Maximum number of parent levels to search through.
   * @returns {Function|null} - The found sendReaction function, or null if not found.
   */
  const getReactFiberUpToDepth = (el, maxDepth = 10) => {
    let fiber = getReactFiber(el)
    let depth = 0

    while (fiber && depth < maxDepth) {
      if (fiber.memoizedProps && typeof fiber.memoizedProps.sendReaction === 'function') {
        return fiber.memoizedProps.sendReaction
      }
      fiber = fiber.return
      ++depth
    }

    return null
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.type !== 'childList' || m.addedNodes.length === 0) return

      const targetNode = Array.from(m.addedNodes).find(
        (n) => n.querySelector && n.querySelector('.reaction-emoji-list')
      )

      if (!targetNode) return

      requestAnimationFrame(() => {
        document.querySelectorAll('.reaction-emoji-list').forEach((el) => {
          if (el.getAttribute('data-zadark-reaction-initialized') === 'true') {
            return
          }

          el.setAttribute('data-zadark-reaction-initialized', 'true')

          const zaloEmojiListWrapperEl = el.closest('.emoji-list-wrapper')
          if (!zaloEmojiListWrapperEl) {
            return
          }

          const sendReaction = getReactFiberUpToDepth(zaloEmojiListWrapperEl, 10)

          const containerEl = document.createElement('div')
          containerEl.className = 'zadark-reaction'
          containerEl.setAttribute('data-open', 'false')

          const closePopover = () => {
            containerEl.setAttribute('data-open', 'false')
          }

          const popoverContentListFragment = document.createDocumentFragment()
          for (const emoji of EMOJI_LIST) {
            const emojiEl = createEmojiEl(emoji, sendReaction, closePopover)
            popoverContentListFragment.appendChild(emojiEl)
          }

          const popoverContentListEl = document.createElement('div')
          popoverContentListEl.className = 'zadark-reaction__popover-content__list'
          popoverContentListEl.appendChild(popoverContentListFragment)

          const popoverContentRecentEl = document.createElement('div')
          popoverContentRecentEl.className = 'zadark-reaction__popover-content__recent'

          const popoverContentEl = document.createElement('div')
          popoverContentEl.className = 'zadark-reaction__popover-content'
          popoverContentEl.appendChild(popoverContentListEl)
          popoverContentEl.appendChild(popoverContentRecentEl)

          popoverContentEl.addEventListener('mouseleave', (e) => {
            containerEl.setAttribute('data-open', 'false')
          })

          let lastRenderedRecentEmojis = ''

          const popoverTriggerEl = document.createElement('button')
          popoverTriggerEl.classList = 'zadark-reaction__popover-trigger'
          popoverTriggerEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>'

          popoverTriggerEl.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            const isOpen = containerEl.getAttribute('data-open') === 'true'
            containerEl.setAttribute('data-open', String(!isOpen))

            if (!isOpen) {
              const recentKey = RECENT_EMOJI_LIST.slice(0, 5).map((e) => `${e.rType}:${e.rIcon}`).join(',')

              if (recentKey === lastRenderedRecentEmojis) {
                return
              }

              lastRenderedRecentEmojis = recentKey

              const recentIconEl = document.createElement('span')
              recentIconEl.className = 'zadark-reaction__popover-content__recent-icon'
              recentIconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>'

              const recentEmojisFragment = document.createDocumentFragment()
              recentEmojisFragment.appendChild(recentIconEl)
              for (const emoji of RECENT_EMOJI_LIST.slice(0, 5)) {
                recentEmojisFragment.appendChild(createEmojiEl(emoji, sendReaction, closePopover))
              }
              popoverContentRecentEl.setAttribute('data-has-recent-emojis', String(RECENT_EMOJI_LIST.length > 0))
              popoverContentRecentEl.replaceChildren(recentEmojisFragment)
            }
          })

          containerEl.appendChild(popoverTriggerEl)
          containerEl.appendChild(popoverContentEl)

          el.appendChild(containerEl)
        })
      })
    })
  })

  observer.observe(document.querySelector('#app'), { childList: true, subtree: true })
})()
