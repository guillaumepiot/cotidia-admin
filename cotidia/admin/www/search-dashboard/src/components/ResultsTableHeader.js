import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

export default class ResultsTableHeader extends Component {
  static propTypes = {
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterColumn: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
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

  render () {
    const { columns, filters, orderAscending, orderColumn } = this.props

    return (
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
    )
  }
}
