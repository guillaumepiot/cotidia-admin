'use strict';

// Polyfill for Element#matches
// @see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
  Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
      };
}

(function () {
  function parentsUntil(element, match, terminate) {
    // Get (and test) the first parent node candidate.
    var candidate = element.parentNode

    if (candidate.matches(match)) {
      return candidate
    }

    // While the current candidate does not match what the termination condition
    // keep traversing up the tree.
    while (! candidate.matches(terminate)) {
      candidate = candidate.parentNode

      // Unless the candidate matches the match condition, in that case just
      // return it!
      if (candidate.matches(match)) {
        return candidate
      }
    }

    // If we got here the loop terminated, so return null.
    return null
  }

  function setFormGroupClass (element, group) {
    // If a group wasn't sent in (which is fine), try to get it.
    if (! group) {
      group = parentsUntil(element, '.form__group', 'form')
    }

    if (group) {
      if (element.matches(':focus')) {
        // If it has focus, mark it as active.
        group.classList.remove('form__group--inactive')
        group.classList.add('form__group--active')
      } else if (element.value || element.matches(':-webkit-autofill')) {
        // Otherwise, it's inactive. *Unless* it has a value or an autofilled
        // value, in which case we call it active.
        group.classList.remove('form__group--inactive')
        group.classList.remove('form__group--active')
      } else {
        // Otherwise it's truly inactive.
        group.classList.remove('form__group--active')
        group.classList.add('form__group--inactive')
      }
    }
  }

  function attachSixteenFormGroupBehaviour (element) {
    // Get the element's (closest) `form__group` parent.
    var group = parentsUntil(element, '.form__group', 'form')

    // if there was no group found, or the group that was found opted out of the
    // animation, do not continue.
    if (
      ! group ||
      group.classList.contains('form__group--no-animate') ||
      group.classList.contains('form__group--boxed')
    ) {
      return
    }
    // First set the initial state of the field. (We have to use setTimeout as
    // autofill may not yet have registered.)
    setTimeout(setFormGroupClass, 0, element, group)

    // Attach the same logic to focus/blur. setTimeout here so the browser has
    // "time" to register the docus/blur as we query it in the setFormGroupClass
    // fuction.
    element.addEventListener('focus', function () {
      setTimeout(setFormGroupClass, 0, element, group)
    })
    element.addEventListener('blur', function () {
      setTimeout(setFormGroupClass, 0, element, group)
    })
  }

  /////////////////////////////////////////////////////////////////////////////

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var inputs = document.querySelectorAll([
      '.form--animate input[type="email"]',
      '.form--animate input[type="number"]',
      '.form--animate input[type="password"]',
      '.form--animate input[type="search"]',
      '.form--animate input[type="tel"]',
      '.form--animate input[type="text"]',
      '.form--animate input[type="url"]',
      '.form--animate select',
      '.form--animate textarea'
    ].join(','))

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
