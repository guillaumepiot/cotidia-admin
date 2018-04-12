'use strict';

(function () {
  function attachSixteenFormGroupBehaviour (element) {
    // First set the initial state of the field. (We have to use setTimeout as autofill may not
    // yet have registered.)
    setTimeout(setFormGroupClass, 0, element)

    // States that change as we go.
    element.addEventListener('focus', function () {
      setFormGroupClass(element)
    })
    element.addEventListener('blur', function () {
      setFormGroupClass(element)
    })
  }

  function setFormGroupClass (element) {
    if (! (element.value || element.matches(':-webkit-autofill') || element.matches(':focus'))) {
      element.parentNode.parentNode.classList.remove('form__group--active')
      element.parentNode.parentNode.classList.add('form__group--inactive')
    } else {
      element.parentNode.parentNode.classList.remove('form__group--inactive')
      element.parentNode.parentNode.classList.add('form__group--active')
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var inputs = document.querySelectorAll('input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="url"], select, textarea')

    Array.prototype.forEach.call(inputs, function (input) {
      attachSixteenFormGroupBehaviour(input)

      document.addEventListener('formfieldsetclass', function () {
        console.log('formfieldsetclass event!')
        Array.prototype.forEach.call(inputs, function (input) {
          setFormGroupClass(input)
        })
      })

    })

    // Textareas should autogrow.
    var textareas = document.querySelectorAll('textarea')

    Array.prototype.forEach.call(textareas, function (textarea) {
      textarea.addEventListener('keyup', function () {
        textarea.style.height = textarea.scrollHeight + 'px'
      })
    })
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
