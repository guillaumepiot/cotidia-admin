import React from 'react'
import moment from 'moment'

import { generateURL } from './api'
import { uuid4 } from './'

import FileUpload from '../components/elements/FileUpload'
import { Icon } from '../components/elements/global'

export const getValueFormatter = (config) => {
  let globalListHandling = config.listHandling

  const formatters = {
    _verbatim: (value) => value,
    verbatim: (value) => (value == null) ? '' : String(value),
    currency: (value, _, __, currency) => value && value.toLocaleString('en', { style: 'currency', currency }),
    date: (value) => value && moment(value).format(config.dateFormat),
    datetime: (value) => value && moment(value).format(config.datetimeFormat),
    boolean: (value) => (
      value ? <Icon icon='check' /> : <Icon icon='times' />
    ),
    link: (value, type) => {
      if (! value) {
        return null
      }

      let link = value

      if (type === 'mailto') {
        link = `mailto:${link}`
      } else if (type === 'tel') {
        link = `tel:${link}`
      }

      return <a href={link} onClick={(e) => e.stopPropagation()}>{value}</a>
    },
    raw: (value) => ({ __html: value }),
    label: (value, type) => value && (
      <span className={`label ${type && `label--${type}`}`}>{value}</span>
    ),
    file: (value, item, accessor, endpoint, extraData) => (
      <FileUpload
        endpoint={generateURL(endpoint, item)}
        extraData={extraData}
        id={uuid4()}
        value={value || ''}
      />
    ),
  }

  /**
   * Yikes this code could really do with a huge refactor to make it less disgusting. The main issue
   * is that it is made to make the implementing devloper's job as easy as possible, so should
   * handle arrays of things like strings, objects with a __html for raw HTML and even React
   * elements (e.g. file uploader widgets). And of course, strings and the other two are treated
   * quite diffrerently.
   * Anyway, it's all quite disgusting, and I hate the multiple-array-iteration, along with cloning
   * React elements, etc., but it's the best I can come up with at the moment.
   */
  return (item, accessor, format, listHandling = globalListHandling) => {
    // If we don't have an item there's not a lot we can do here. Bail.
    if (! item) {
      return null
    }

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

    const formatValue = (value) => {
      value = format(value, item, accessor, ...extraArgs)

      // If value signals that its raw HTML, just wrap it in a React span and dangerouslySetInnerHTML.
      if (value?.__html) {
        return <span dangerouslySetInnerHTML={value} />
      }

      // Otherwise just return it as-is.
      return value
    }

    // Use formatter to get actual value(s) from data.
    if (Array.isArray(value)) {
      const values = value.map(formatValue)

      if (listHandling.style === 'string') {
        return values.reduce((acc, value, index) => {
          if (React.isValidElement(value)) {
            acc.push(React.cloneElement(value, { key: index }))
          } else {
            acc.push(value)
          }

          acc.push(listHandling.value)

          return acc
        }, []).slice(0, -1)
      } else if (listHandling.style === 'element') {
        return values.map((value, index) => (
          <listHandling.value key={index} {...listHandling.props}>{value}</listHandling.value>
        ))
      }
    } else {
      return formatValue(value)
    }
  }
}
