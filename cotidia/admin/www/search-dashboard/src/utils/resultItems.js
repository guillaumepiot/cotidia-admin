import React from 'react'
import moment from 'moment'

const getItem = (item, accessor) => {
  const parts = accessor.split('__')

  let value = item
  let part

  // Go through each part of the accessor and 'recurse' into the data structure:
  // If item = { a: { b: { c: 'hi' } } } and accessor is a__b__c it'll return `'hi'`

  // eslint-disable-next-line no-cond-assign
  while (part = parts.shift()) {
    value = value?.[part]
  }

  return value
}

const formatters = {
  verbatim: (value) => (value == null) ? '' : String(value),
  date: (value) => moment(value).format('D MMM YYYY'),
  datetime: (value) => moment(value).format('D MMM YYYY @ HH:mm'),
  boolean: (value) => (
    value ? <span className='fa fa-check' /> : <span className='fa fa-times' />
  ),
}

export const getFormattedValue = (item, accessor, format) => {
  const value = getItem(item, accessor)

  // If the format config is a function in its own right, just defer to it, passing the whole item,
  // the field name (accessor) and the value we think that field has.
  if (typeof format === 'function') {
    return format(item, accessor, value)
  }

  // Otherwise, let's assume verbatim and see if an actual formatter was passed in that we can use.

  let formatter = formatters.verbatim

  if (typeof format === 'string') {
    formatter = formatters[format] || formatters.verbatim
  }

  // Finally call the formatter on value, or, if the value is an array, on each element within the
  // array and then join all the results by a comma.
  if (Array.isArray(value)) {
    return value.map((value) => formatter(value)).join(', ')
  } else {
    return formatter(value)
  }
}
