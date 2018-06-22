import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

export default class ResultsTableHeader extends PureComponent {
  static propTypes = {
    allSelected: PropTypes.bool.isRequired,
    batchActions: PropTypes.arrayOf(PropTypes.object),
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterColumn: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    setOrderColumn: PropTypes.func.isRequired,
    toggleSelectAllResults: PropTypes.func,
    toggleOrderDirection: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchActions: [],
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

  toggleSelectAllResults = (e) => {
    e.stopPropagation()

    this.props.toggleSelectAllResults()
  }

  render () {
    const {
      allSelected,
      batchActions,
      columns,
      filters,
      orderAscending,
      orderColumn,
    } = this.props

    return (
      <thead>
        <tr>
          {(batchActions.length > 0) && (
            <th className='table__header table-header' onClick={this.toggleSelectAllResults}>
              <input type='checkbox' checked={allSelected} />
            </th>
          )}
          {columns.map((column) => {
            if (column.type === 'data') {
              return (
                <th
                  className={`table__header table-header ${column.orderable !== false ? 'table-header--clickable' : ''}`}
                  key={column.id}
                  onClick={column.orderable !== false ? this.setOrderColumnFactory(column.id) : null}
                >
                  <span className='table-header__name'>
                    {column.label}
                    {(column.orderable !== false) && (
                      <>
                        {' '}
                        {(orderColumn === column.id) ? (orderAscending ? (
                          <Icon className='table-header__sort table-header__sort--active' icon='long-arrow-alt-down' />
                        ) : (
                          <Icon className='table-header__sort table-header__sort--active' icon='long-arrow-alt-up' />
                        )) : (
                          <Icon className='table-header__sort' icon='long-arrow-alt-down' />
                        )}
                      </>
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
              )
            } else if (column.type === 'separator') {
              return (
                <th
                  className='table__header table-header table-header--separator'
                  key={column.id}
                />
              )
            }
          })}
        </tr>
      </thead>
    )
  }
}
