'use strict';

(function () {
  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var tabs = document.querySelectorAll('.hide-message')

    Array.prototype.forEach.call(tabs, function (elm) {
      elm.addEventListener('click', function() {
        this.parentNode.classList.add('alert--hide')
      })
    })
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
