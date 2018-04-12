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
    var group = element.parentNode.parentNode

    if (element.matches(':focus')) {
      group.classList.remove('form__group--inactive')
      group.classList.add('form__group--active')
    } else if (element.value || element.matches(':-webkit-autofill')) {
      group.classList.remove('form__group--inactive')
      group.classList.remove('form__group--active')
    } else {
      group.classList.remove('form__group--active')
      group.classList.add('form__group--inactive')
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
    })

    document.addEventListener('formfieldsetclass', function () {
      Array.prototype.forEach.call(inputs, function (input) {
        setFormGroupClass(input)
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
