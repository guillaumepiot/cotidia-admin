(function(){
  function showMenu (menu, e) {
    e.preventDefault()
    menu.querySelector('.menu__container').classList.add('menu__container--mobile-active')
  }

  function hideMenu (menu, e) {
    e.preventDefault()
    menu.querySelector('.menu__container').classList.remove('menu__container--mobile-active')
  }

  function collapseSidebar () {
    document.body.classList.add('menu--sidebar-collapse')
    CookiesHelper.createCookie("cotidiaadminsidebar", 'collapse', 365)
  }

  function expandSidebar () {
    document.body.classList.remove('menu--sidebar-collapse')
    CookiesHelper.eraseCookie("cotidiaadminsidebar")
  }

  function getSidebarCookieValue () {
    return document.cookie.replace(/(?:(?:^|.*;\s*)cotidiaadminsidebar\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  }


  // For each instance of .menu
  function initMenu () {
    var menus = document.querySelectorAll('.menu')
    for (i = 0; i < menus.length; i++) {
      var menu = menus[i]
      menuOpenButton = menu.querySelector('.menu__item--open a')

      if (menuOpenButton) {
        menuOpenButton.addEventListener('touchend', showMenu.bind(null, menu))
        menuOpenButton.addEventListener('click', showMenu.bind(null, menu))
      }

      menuCloseButton = menu.querySelector('.menu__item--close a')

      if (menuCloseButton) {
        menuCloseButton.addEventListener('touchend', hideMenu.bind(null, menu))
        menuCloseButton.addEventListener('click', hideMenu.bind(null, menu))
      }
    }
    var collapseSidebarBtn = document.querySelector('.menu__item--sidebar-collapse')
    if (collapseSidebarBtn) {
      collapseSidebarBtn.addEventListener('touchend', collapseSidebar)
      collapseSidebarBtn.addEventListener('click', collapseSidebar)
    }

    var expandSidebarBtn = document.querySelector('.menu__item--sidebar-expand')
    if (expandSidebarBtn) {
      expandSidebarBtn.addEventListener('touchend', expandSidebar)
      expandSidebarBtn.addEventListener('click', expandSidebar)
    }

    // Shortcuts handling
    var shortcutsElm = document.getElementById('id_shortcuts')
    if (shortcutsElm) {
      shortcutsElm.addEventListener('change', function() {
        if (this.value) {
          window.location = this.value
        }
      })
    }

    // Category menu toggle
    document.querySelectorAll('.menu-category__toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        toggle.parentElement.classList.toggle('menu-category--open')

        document.querySelectorAll('.menu-category--open').forEach(function (item) {
          if (item !== toggle.parentElement) {
            item.classList.remove('menu-category--open')
          }
        })
      })
    })
  }

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    // Automatically add the sidebar collapse class if we are in collapse mode.
    if (getSidebarCookieValue() == "collapse") {
      document.body.classList.add('menu--sidebar-hidden')
      document.body.classList.add('menu--sidebar-collapse')
      // Allow time to apply the class before removing it
      setTimeout(function(){
        document.body.classList.remove('menu--sidebar-hidden')
      }, 1)

    }

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
