(function () {
  // const log = console.log.bind(console, '[zadark-zconv]')

  /**
   * @param {HTMLElement} convItem
   * @returns {string}
   */
  function getConvId (convItem) {
    if (!convItem) {
      return null
    }

    const reactInstanceKey = Object.keys(convItem).find((e) => e.startsWith('__reactInternalInstance'))
    const reactProps = convItem[reactInstanceKey]
    if (!reactProps) {
      return null
    }

    return reactProps.key
  }

  /**
   * @param {string} convId
   */
  function fireConvIdChange (convId) {
    const currentConvId = document.body.getAttribute('data-current-conv-id')
    if (convId === currentConvId) {
      return
    }

    if (!convId) {
      document.body.removeAttribute('data-current-conv-id')
    } else {
      document.body.setAttribute('data-current-conv-id', convId)
    }

    document.dispatchEvent(new CustomEvent('@ZaDark:CONV_ID_CHANGE'))
  }

  function addConvClickEventListener () {
    const conversationList = document.getElementById('conversationListId')

    conversationList && conversationList.addEventListener('click', function (event) {
      const convItem = event.target.closest('.msg-item')
      if (!convItem || !conversationList.contains(convItem)) {
        return
      }

      const moreButton = convItem.querySelector('.conv-item-title__more')
      if (moreButton && (moreButton === event.target || moreButton.contains(event.target))) {
        return
      }

      const convId = getConvId(convItem)
      fireConvIdChange(convId)
    })
  }

  function handleWindowFocus () {
    const main = document.querySelector('#container > main')

    if (!main) {
      return
    }

    const reactInstanceKey = Object.keys(main).find((e) => e.startsWith('__reactInternalInstance'))
    const reactProps = main[reactInstanceKey]
    if (!reactProps) {
      return null
    }

    const { convId } = reactProps.return.pendingProps
    fireConvIdChange(convId)
  }

  function debounce (func, delay) {
    let timer
    return function () {
      clearTimeout(timer)
      timer = setTimeout(func, delay)
    }
  }

  function addFocusEventListener () {
    if (document.body.classList.contains('zadark-pc')) {
      window.$zwindow.onVisibilityChange(debounce(handleWindowFocus, 200))
    } else {
      window.addEventListener('focus', debounce(handleWindowFocus, 200))
    }
  }

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.id === 'app-page') {
          addConvClickEventListener()
          addFocusEventListener()

          observer.disconnect()
        }
      })
    })
  })

  observer.observe(document.querySelector('#app'), { subtree: false, childList: true })
})()
