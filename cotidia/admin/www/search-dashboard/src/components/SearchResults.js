import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { generateURL } from '../utils/api'

import ResultsTableHeader from './ResultsTableHeader'
import Pagination from '../containers/Pagination'

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
    loading: PropTypes.bool,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    setOrderColumn: PropTypes.func.isRequired,
    toggleOrderDirection: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loading: false,
  }

  viewItemFactory = (item) => (e) => {
    if (this.props.detailURL) {
      window.location = generateURL(this.props.detailURL, item)
    }
  }

  render () {
    const {
      clearFilter,
      columns,
      detailURL,
      filterColumn,
      filters,
      loading,
      orderColumn,
      orderAscending,
      results,
      setOrderColumn,
      toggleOrderDirection,
    } = this.props

    return (
      <>
        <table className={`table ${detailURL ? 'table--clickable' : ''} table--admin-mobile-view ${loading ? 'table--loading' : ''}`}>
          <ResultsTableHeader
            columns={columns}
            filters={filters}
            orderAscending={orderAscending}
            orderColumn={orderColumn}
            clearFilter={clearFilter}
            filterColumn={filterColumn}
            setOrderColumn={setOrderColumn}
            toggleOrderDirection={toggleOrderDirection}
          />
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
