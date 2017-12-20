import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { generateURL } from '../utils/api'

import Pagination from '../containers/Pagination'

import { Icon } from './elements/global'

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

export default class SearchResults extends Component {
  static propTypes = {
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    detailURL: PropTypes.string,
    filterColumn: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    setOrderColumn: PropTypes.func.isRequired,
    toggleOrderDirection: PropTypes.func.isRequired,
  }

  filterColumnFactory = (column) => (e) => {
    // Because this event will be a button inside a component that it also looking for a click
    // event, we should stop the propagation of the event so both aren't handled.
    e.stopPropagation()

    this.props.filterColumn(column)
  }

  clearFilterFactory = (column) => (e) => {
    // Because this event will be a button inside a component that it also looking for a click
    // event, we should stop the propagation of the event so both aren't handled.
    e.stopPropagation()

    this.props.clearFilter(column)
  }

  setOrderColumnFactory = (column) => (e) => {
    if (this.props.orderColumn === column) {
      this.props.toggleOrderDirection()
    } else {
      this.props.setOrderColumn(column)
    }
  }

  viewItemFactory = (item) => (e) => {
    if (this.props.detailURL) {
      window.location = generateURL(this.props.detailURL, item)
    }
  }

  render () {
    const {
      columns,
      detailURL,
      filters,
      orderColumn,
      orderAscending,
      results,
    } = this.props

    return (
      <>
        <table className={`table ${detailURL ? 'table--clickable' : ''} table--stack-mobile`}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th className='table__header table-header' key={column.id} onClick={this.setOrderColumnFactory(column.id)}>
                  <span className='table-header__name'>
                    {column.label}
                    {' '}
                    {(orderColumn === column.id) ? (orderAscending ? (
                      <Icon className='table-header__sort table-header__sort--active' icon='long-arrow-down' />
                    ) : (
                      <Icon className='table-header__sort table-header__sort--active' icon='long-arrow-up' />
                    )) : (
                      <Icon className='table-header__sort' icon='long-arrow-down' />
                    )}
                  </span>

                  {column.filter && (
                    <span className={`table-header__actions ${filters.includes(column.id) ? 'table-header__actions--active' : ''}`}>
                      {filters.includes(column.id) && (
                        <button
                          className={`btn btn--link btn--small pull-right btn--delete`}
                          onClick={this.clearFilterFactory(column.id)}
                        >
                          <Icon icon='times' />
                        </button>
                      )}
                      <button
                        className={`btn btn--link btn--small pull-right ${filters.includes(column.id) ? 'btn--primary' : 'btn--cancel'}`}
                        onClick={this.filterColumnFactory(column.id)}
                      >
                        <Icon icon='filter' />
                      </button>
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.uuid} onClick={this.viewItemFactory(item)}>
                {columns.map((column) => (
                  <td data-header={column.label} key={column.id}>
                    {getFormattedValue(item, column.accessor, column.display)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination />
      </>
    )
  }
}
