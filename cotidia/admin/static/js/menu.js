(function(){
  function showMenu(menu) {
    menu.querySelector('.menu__container').classList.add('menu__container--mobile-active')
  }

  function hideMenu(menu) {
    menu.querySelector('.menu__container').classList.remove('menu__container--mobile-active')
  }

  // For each instance of .menu
  function initMenu() {
    var menus = document.querySelectorAll('.menu')
    console.log(menus)
    for (i = 0; i < menus.length; i++) {
      var menu = menus[i]
      console.log(menu)
      menuOpenButton = menu.querySelector('.menu__item--open a')
      menuOpenButton.addEventListener('touchend', showMenu.bind(null, menu))
      menuOpenButton.addEventListener('click', showMenu.bind(null, menu))

      menuCloseButton = menu.querySelector('.menu__item--close a')
      menuCloseButton.addEventListener('touchend', hideMenu.bind(null, menu))
      menuCloseButton.addEventListener('click', hideMenu.bind(null, menu))
    }
  }

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)
    initMenu()
  }

  // Initialize our menu if the document is ready, otherwise listen to its
  // ready state and bootstrap it when ready
  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
})()
