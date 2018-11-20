'use strict';

(function () {
  if (window.React && window.ReactDOM && window.TypeaheadSwitcher) {
    document.querySelectorAll('[data-widget="typeahead-switcher"]').forEach(function (typeahead) {
      var endpoint = typeahead.dataset.typeaheadEndpoint
      var placeholder
      var minchars = typeahead.dataset.typeaheadMinchars ? parseInt(typeahead.dataset.typeaheadMinchars) : 1
      var extraGroupClasses = null

      if (typeahead.querySelector('[placeholder]')) {
        placeholder = typeahead.querySelector('[placeholder]').getAttribute('placeholder')
      }

      if (typeahead.querySelector('.form__group')) {
        extraGroupClasses = Array.prototype.slice.call(typeahead.querySelector('.form__group').classList)
      }

      ReactDOM.render(
        React.createElement(
          window.TypeaheadSwitcher,
          {
            apiEndpoint: endpoint,
            placeholder: placeholder,
            minchars: minchars,
            extraGroupClasses: extraGroupClasses,
          }
        ),
        typeahead.parentElement
      )
    })
  }

  if (window.React && window.ReactDOM && window.TypeaheadSelectWidget) {
    document.querySelectorAll('[data-widget="typeahead-select"]').forEach(function (formGroup) {
      var initialData = JSON.parse(formGroup.dataset.initial)

      var keyedData = {}
      for (var i = 0; i< initialData.length; i++) {
        keyedData[initialData[i].value] = initialData[i].label
      }

      var parent = formGroup.parentElement
      var name = formGroup.dataset.name
      var multiple = 'multiple' in formGroup.dataset

      var initialValue = ''

      if (multiple) {
        initialValue = Array.prototype.map.call(
          formGroup.querySelectorAll('input[value]'),
          function (item) {
            return { value: item.value, label: keyedData[item.value] || '' }
          }
        )
      } else {
        if (formGroup.querySelector('input[value]')) {
          initialValue = formGroup.querySelector('input[value]').value
        }
      }

      var config = {
        apiEndpoint: formGroup.dataset.typeaheadEndpoint,
        defaultOptions: initialData,
        extraGroupClasses: Array.prototype.slice.call(formGroup.classList),
        id: formGroup.dataset.id || null,
        initialValue: initialValue,
        label: formGroup.dataset.label,
        minchars: formGroup.dataset.typeaheadMinchars ? parseInt(formGroup.dataset.typeaheadMinchars) : 1,
        multiple: multiple,
        name: name,
        onUpdate: function (value) {
          var event = new CustomEvent('change', {
            bubbles: true,
            detail: {
              name: name,
              value: value,
            }
          })

          parent.dispatchEvent(event)
        },
        placeholder: formGroup.dataset.placeholder,
      }

      ReactDOM.render(
        React.createElement(
          window.TypeaheadSelectWidget,
          config
        ),
        parent
      )
    })
  }
}())
