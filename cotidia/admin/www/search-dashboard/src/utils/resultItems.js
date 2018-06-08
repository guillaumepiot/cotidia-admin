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
  link: (value, type) => {
    let link = value

    if (type === 'mailto') {
      link = `mailto:${link}`
    } else if (type === 'tel') {
      link = `tel:${link}`
    }

    return <a href={link} onClick={(e) => e.stopPropagation()}>{value}</a>
  },
  raw: (value) => <span dangerouslySetInnerHTML={{ __html: value }} />,
  label: (value, type) => (
    <span className={`label ${type && `label--${type}`}`}>{value}</span>
  ),
}

export const getFormattedValue = (item, accessor, format) => {
  const value = getItem(item, accessor)

  // If the format config is a function in its own right, just defer to it, passing the whole item,
  // the field name (accessor) and the value we think that field has.
  if (typeof format === 'function') {
    return format(item, accessor, value)
  }

  // Otherwise, use the formatter as it was passed in, defaulting to verbatim for a formatter that's not recognised.

  format = (typeof format === 'string') ? format : 'verbatim'

  // Parse the actual name and any formatter agruments out of the compound name as given.
  const [ actualFormat, ...args ] = format.split(':')

  // Get actual formatter function from formatter name.
  const formatter = formatters[actualFormat] || formatters.verbatim

  // Finally call the formatter on value, or, if the value is an array, on each element within the
  // array and then join all the results by a comma.
  if (Array.isArray(value)) {
    return value.map((value) => formatter(value, ...args)).join(', ')
  } else {
    return formatter(value, ...args)
  }
}
