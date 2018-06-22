import React from 'react'
import moment from 'moment'

import FileUpload from '../components/elements/FileUpload'

import { uuid4 } from './'

export const getValueFormatter = (config) => {
  let globalListHandling = config.listHandling

  const formatters = {
    _verbatim: (value) => value,
    verbatim: (value) => (value == null) ? '' : String(value),
    date: (value) => moment(value).format(config.dateFormat),
    datetime: (value) => moment(value).format(config.datetimeFormat),
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
    raw: (value) => ({ __html: value }),
    label: (value, type) => (
      <span className={`label ${type && `label--${type}`}`}>{value}</span>
    ),
    file: (value, item, accessor, endpoint, extraData) => (
      <FileUpload
        endpoint={endpoint.replace(':uuid', item.uuid)}
        extraData={extraData}
        id={uuid4()}
        value={value || ''}
      />
    ),
  }

  return (item, accessor, format, listHandling = globalListHandling) => {
    // Get initial raw value from item.
    let value = item[accessor]

    // Construct initial args to pass into formatter.
    let extraArgs = []

    // If formatter is not a function, try to resolve one.
    if (! (typeof format === 'function')) {
      let actualFormat

      // Parse the actual name and any formatter agruments out of the compound name as given.
      if (typeof format === 'string') {
        format = format.split(':')
      }

      if (! Array.isArray(format)) {
        format = []
      }

      // Separate format descriptor from its config.
      [ actualFormat, ...extraArgs ] = format

      // Get actual formatter function from formatter name.
      format = formatters[actualFormat] || formatters.verbatim
    }

    // Use formatter to get actual value(s) from data.
    if (Array.isArray(value)) {
      const values = value.map((value) => format(value, item, accessor, ...extraArgs))

      if (listHandling.style === 'string') {
        value = values.join(listHandling.value)
      } else if (listHandling.style === 'element') {
        value = values.map((value) => (
          <listHandling.value {...listHandling.props}>{value}</listHandling.value>
        ))
      }
    } else {
      value = format(value, item, accessor, ...extraArgs)
    }

    // If value signals that its raw HTML, just wrap it in a React span and dangerouslySetInnerHTML.
    if (value.__html) {
      return <span dangerouslySetInnerHTML={value} />
    } else {
      return value
    }
  }
}
