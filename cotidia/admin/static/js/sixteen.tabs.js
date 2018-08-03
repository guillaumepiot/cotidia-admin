'use strict';

(function () {
  function Tabs (elm) {
    this.tabs = elm
    this.tab_labels = this.tabs.querySelectorAll('.tab__label')

    this.tab_labels.forEach(function (tab_label) {
      tab_label.addEventListener('click', function () {
        elm.querySelectorAll('.tab__label').forEach(function (tl) {
          tl.classList.remove('tab__label--active');
        })
        elm.querySelectorAll('.tab__panel').forEach(function (tp) {
          tp.classList.remove('tab__panel--active');
        })
        // Add active class to label
        tab_label.classList.add('tab__label--active');
        // Add active class to corresponding panel
        elm.querySelector(tab_label.getAttribute('href')).classList.add('tab__panel--active');
      })
    })
  }

  /////////////////////////////////////////////////////////////////////////////

  // Bootstrap any slideshows

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var tabs = document.querySelectorAll('.tabs')

    Array.prototype.forEach.call(tabs, function (elm) {
      new Tabs(elm)
    })
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
