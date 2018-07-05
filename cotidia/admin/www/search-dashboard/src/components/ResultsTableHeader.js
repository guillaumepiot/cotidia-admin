import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

import { Icon } from './elements/global'
import { uuid4 } from '../utils'

const DragHandle = SortableHandle(() => (
  <span className='table-header__item'>
    <button className='btn btn--link btn--small'>
      <Icon icon='arrows-alt' />
    </button>
  </span>
))

const SortableList = SortableContainer(({ children }) => <tr>{children}</tr>)

const Header = SortableElement(({
  column,
  isFiltered,
  isOrderColumn,
  orderable,
  orderAscending,
  setOrderColumn,
  clearFilter,
  filterColumn,
}) => (
  <th className='nowrap' onClick={setOrderColumn}>
    <span className='table-header__name'>
      {column.label}
    </span>

    {/*
    Using a 'random' and always-changing key here means that the span will *always*
    rerender, this is because we may change the sort order icon, and because
    FontAwesome replaces our span with an SVG, React doesn't know how to perform this
    change so just doesn't do anything. If we tell the parent to *alwasy* rerender,
    it's not the best on perf, but does mean we get icons actually changing.
    */}
    {orderable && (
      <span
        className={`table-header__item ${isOrderColumn ? 'table-header__item--active' : ''}`}
        key={uuid4()}
      >
        {isOrderColumn && orderAscending && (
          <Icon icon='long-arrow-alt-down' />
        )}
        {isOrderColumn && ! orderAscending && (
          <Icon icon='long-arrow-alt-up' />
        )}
        {! isOrderColumn && (
          <Icon icon='long-arrow-alt-down' />
        )}
      </span>
    )}

    {isFiltered && (
      <span
        className='table-header__item tooltip tooltip--bottom-center table-header__item--active'
        data-tooltip='Clear filter'
      >
        <button className='btn btn--link btn--small' onClick={clearFilter}>
          <Icon icon='times' />
        </button>
      </span>
    )}

    {column.filter && (
      <span
        className={`table-header__item tooltip tooltip--bottom-center ${isFiltered ? 'table-header__item--active' : ''}`}
        data-tooltip='Filter'
      >

        <button className='btn btn--link btn--small' onClick={filterColumn}>
          <Icon icon='filter' />
        </button>
      </span>
    )}

    <DragHandle />
  </th>
))

const SeparatorHeader = SortableElement(() => (
  <th className='nowrap table-header--separator'>
    <DragHandle />
  </th>
))

const BatchActionsHeader = SortableElement(({ toggleSelectAllResults, allSelected }) => (
  <th className='nowrap' onClick={toggleSelectAllResults}>
    <input type='checkbox' checked={allSelected} />
  </th>
))

export default class ResultsTableHeader extends Component {
  static propTypes = {
    allSelected: PropTypes.bool.isRequired,
    batchActions: PropTypes.arrayOf(PropTypes.object),
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    categoriseBy: PropTypes.object,
    configureFilter: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    moveColumn: PropTypes.func.isRequired,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    setOrderColumn: PropTypes.func.isRequired,
    toggleSelectAllResults: PropTypes.func.isRequired,
    toggleOrderDirection: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchActions: [],
  }

  configureFilterFactory = (column) => (e) => {
    // Because this event will be a button inside a component that it also looking for a click
    // event, we should stop the propagation of the event so both aren't handled.
    e.stopPropagation()

    this.props.configureFilter(column)
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

  handleSortHeaders = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      this.props.moveColumn(oldIndex, newIndex)
    }
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
        <SortableList
          axis='x'
          helperClass='dragging-table-header'
          lockAxis='x'
          onSortEnd={this.handleSortHeaders}
          useDragHandle
        >
          {(batchActions.length > 0) && (
            <BatchActionsHeader
              toggleSelectAllResults={this.toggleSelectAllResults}
              allSelected={allSelected}
            />
          )}
          {columns.map((column, index) => {
            if (column.type === 'data') {
              const orderable = categoriseBy == null && column.orderable !== false
              const isOrderColumn = orderColumn === column.id
              const isFiltered = filters.includes(column.id)

              return (
                <Header
                  key={column.id}
                  index={index}
                  column={column}
                  isFiltered={isFiltered}
                  isOrderColumn={isOrderColumn}
                  orderable={orderable}
                  orderAscending={orderAscending}
                  setOrderColumn={orderable ? this.setOrderColumnFactory(column.id) : null}
                  clearFilter={this.clearFilterFactory(column.id)}
                  filterColumn={this.configureFilterFactory(column.id)}
                />
              )
            } else if (column.type === 'separator') {
              return <SeparatorHeader key={column.id} index={index} />
            }
          })}
        </SortableList>
      </thead>
    )
  }
}
