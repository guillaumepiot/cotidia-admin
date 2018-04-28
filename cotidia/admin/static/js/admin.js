(function(){

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var toolbarProfileButton = document.querySelector('.toolbar-profile__avatar')
    var toolbarProfileMenu = document.querySelector('.toolbar-profile__menu')

    // Automatically add the sidebar collapse class if we are in collapse mode.
    if (toolbarProfileButton && toolbarProfileMenu) {
      toolbarProfileButton.addEventListener('focus', function () {
        toolbarProfileMenu.classList.add('toolbar-profile__menu--active')
      })
      toolbarProfileButton.addEventListener('blur', function () {
        setTimeout(function () {
          toolbarProfileMenu.classList.remove('toolbar-profile__menu--active')
        }, 250)

      })
    }

  }

  // Initialize our menu if the document is ready, otherwise listen to its
  // ready state and bootstrap it when ready
  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
})()
