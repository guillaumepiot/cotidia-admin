import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'
import { uuid4 } from '../utils'

export default class ResultsTableHeader extends PureComponent {
  static propTypes = {
    allSelected: PropTypes.bool.isRequired,
    batchActions: PropTypes.arrayOf(PropTypes.object),
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    categoriseBy: PropTypes.object,
    filterColumn: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    setOrderColumn: PropTypes.func.isRequired,
    toggleSelectAllResults: PropTypes.func.isRequired,
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
      categoriseBy,
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
            const orderable = categoriseBy == null && column.orderable !== false

            if (column.type === 'data') {
              return (
                <th
                  className={`table__header table-header ${orderable ? 'table-header--clickable' : ''}`}
                  key={column.id}
                  onClick={orderable ? this.setOrderColumnFactory(column.id) : null}
                >
                  {/*
                  Using a 'random' and always-changing key here means that the span will *always*
                  rerender, this is because we may change the sort order icon, and because
                  FontAwesome replaces our span with an SVG, React doesn't know how to perform this
                  change so just doesn't do anything. If we tell the parent to *alwasy* rerender,
                  it's not the best on perf, but does mean we get icons actually changing.
                  */}
                  <span className='table-header__name' key={uuid4()}>
                    {column.label}
                    {orderable && (
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
