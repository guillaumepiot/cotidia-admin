'use strict';

// IMPORTANT
// Relies on Sortable.JS (https://github.com/RubaXa/Sortable)
// Include script from CDN at top of the file
//<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>

(function () {
  function contentFootState (el) {
    this.el = el
    this.checkPositing()
    window.addEventListener('resize', this.checkPositing.bind(this))
  }

  contentFootState.prototype.checkPositing = function () {
    var elRect = this.el.getBoundingClientRect()
    if (elRect.y + elRect.height >= window.innerHeight) {
      this.el.classList.add('content__foot--sticky')
    } else {
      this.el.classList.remove('content__foot--sticky')
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  // Bootstrap any file uploaders

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var contentFoot = document.querySelector('.content__foot')
    if (contentFoot) {
      new contentFootState(contentFoot)
    }
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
