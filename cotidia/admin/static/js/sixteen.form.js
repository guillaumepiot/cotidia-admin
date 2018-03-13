'use strict';

(function () {
  function FieldBehaviour (elm) {

    if (! elm.value) elm.parentNode.parentNode.classList.add("form__group--inactive")
    elm.addEventListener('focus', function() {
        elm.parentNode.parentNode.classList.add("form__group--active")
        elm.parentNode.parentNode.classList.remove("form__group--inactive")
    })
    elm.addEventListener('blur', function() {
        elm.parentNode.parentNode.classList.remove("form__group--active")
        if (! elm.value) elm.parentNode.parentNode.classList.add("form__group--inactive")
    })
    if (elm.tagName == 'TEXTAREA'){
        elm.addEventListener('keyup', function() {
            elm.style.height = elm.scrollHeight + "px";
        })
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  // Bootstrap any slideshows

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var elms = document.querySelectorAll('input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="url"], select, textarea');

    Array.prototype.forEach.call(elms, function (elm) {
      new FieldBehaviour(elm)
    })
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
