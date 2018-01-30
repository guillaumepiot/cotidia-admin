import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
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

const getFormattedValue = (item, accessor, format) => {
  const value = getItem(item, accessor)

  const formatter = formatters[format] || formatters.verbatim

  if (Array.isArray(value)) {
    return value.map((value) => formatter(value)).join(', ')
  } else {
    return formatter(value)
  }
}

// Normally we wouldn't bother with perf optimisation, but this takes a render of 250 items down
// from 130ms to 25-30ms when only one of the items changes (e.g. select an item).
export default class ResultsTableItem extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    checkItem: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    item: PropTypes.object.isRequired,
    showCheck: PropTypes.bool.isRequired,
    viewItem: PropTypes.func.isRequired,
  }

  viewItem = () => {
    this.props.viewItem(this.props.item)
  }

  checkItem = (e) => {
    e.stopPropagation()
    this.props.checkItem(this.props.item)
  }

  render () {
    const {
      checked,
      columns,
      item,
      showCheck,
    } = this.props

    return (
      <tr key={item.uuid} onClick={this.viewItem}>
        {showCheck && (
          <td onClick={this.checkItem}>
            <input type='checkbox' checked={checked} />
          </td>
        )}
        {columns.map((column) => (
          <td data-header={column.label} key={column.id}>
            {getFormattedValue(item, column.accessor, column.display)}
          </td>
        ))}
      </tr>
    )
  }
}
