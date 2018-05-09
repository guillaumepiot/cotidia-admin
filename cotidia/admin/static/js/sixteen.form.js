'use strict';

(function () {
  function attachSixteenFormGroupBehaviour (element) {
    if (element.parentNode.parentNode.classList.contains('form__group--no-animate')) {
      return
    }
    // First set the initial state of the field. (We have to use setTimeout as autofill may not
    // yet have registered.)
    setTimeout(setFormGroupClass, 0, element)

    // States that change as we go.
    element.addEventListener('focus', function () {
      setTimeout(setFormGroupClass, 0, element)
    })
    element.addEventListener('blur', function () {
      setTimeout(setFormGroupClass, 0, element)
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

    var inputs = document.querySelectorAll('.form--animate input[type="email"], .form--animate input[type="number"], .form--animate input[type="password"], .form--animate input[type="search"], .form--animate input[type="tel"], .form--animate input[type="text"], .form--animate input[type="url"], .form--animate select, .form--animate textarea')

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
