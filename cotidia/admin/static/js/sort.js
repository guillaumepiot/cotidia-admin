'use strict';

// IMPORTANT
// Relies on Sortable.JS (https://github.com/RubaXa/Sortable)
// Include script from CDN at top of the file
//<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>

(function () {
  function FileSorter (el, headers) {

    this.el = el
    this.headers = headers
    this.uploadUrl = '/api/generic/sort/'+window.content_type_id

    Sortable.create(el, {
        handle: ".btn--drag",
        dragClass: "alert",
        animation: 150,
        onEnd: this.getOrder.bind(this),
    });
  }

  FileSorter.prototype.getOrder = function (ev) {
      var arr = this.el.querySelectorAll('tr');
      var result = [];
      arr.forEach(function(elm) {
          result.push(elm.getAttribute('data-id'));
      });
      this.updateOrder(result)
  }

  FileSorter.prototype.updateOrder = function (result) {

    var xhr = new XMLHttpRequest()

    var self = this

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Ordering complete')
      } else {
        console.log('Ordering error')
      }
    }

    xhr.onerror = function () {
      alert('An error has occurred while updating the file order.')
    }

    var data = {
      'data': result
    }

    xhr.open('POST', this.uploadUrl)

    this.headers['Content-Type'] = 'application/json'

    if (this.headers) {
      Object.keys(this.headers).forEach(function (header) {
        xhr.setRequestHeader(header, self.headers[header])
      })
    }

    xhr.send(JSON.stringify(data))
  }

  /////////////////////////////////////////////////////////////////////////////

  // Bootstrap any file uploaders

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var csrfToken = null

    if (document.querySelector('[name=csrfmiddlewaretoken]')) {
      csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value
    }

    var fileLists = document.querySelectorAll('.table tbody')

    for (var i = 0; i < fileLists.length; i++) {
      new FileSorter(fileLists[i], { 'X-CSRFToken': csrfToken })
    }
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
