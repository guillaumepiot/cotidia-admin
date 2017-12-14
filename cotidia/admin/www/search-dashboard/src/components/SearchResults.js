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

  filterColumnFactory = (column) => (e) => this.props.filterColumn(column)
  clearFilterFactory = (column) => (e) => this.props.clearFilter(column)

  setOrderColumnFactory = (column) => (e) => this.props.setOrderColumn(column)

  toggleOrderDirection = (e) => this.props.toggleOrderDirection()

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
      <div className='content__list'>
        <table className={`table ${detailURL ? 'table--clickable' : ''} table--stack-mobile`}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>
                  <span onClick={(orderColumn === column.id) ? this.toggleOrderDirection : this.setOrderColumnFactory(column.id)} style={{ cursor: 'pointer' }}>
                    {column.label}
                    {' '}
                    {(orderColumn === column.id) ? (orderAscending ? (
                      <Icon icon='sort-asc' />
                    ) : (
                      <Icon icon='sort-desc' />
                    )) : (
                      <Icon icon='sort' />
                    )}
                  </span>

                  {column.filter && (
                    <>
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
                    </>
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
      </div>
    )
  }
}
