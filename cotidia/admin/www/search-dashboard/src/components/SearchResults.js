import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Icon } from './elements/global'

const columnDisplayTypes = {
  verbatim: (item, accessor) => String(item[accessor]),
  date: (item, accessor) => moment(item[accessor]).format('D MMM YYYY'),
  datetime: (item, accessor) => moment(item[accessor]).format('D MMM YYYY @ HH:MM'),
  boolean: (item, accessor) => (
    item[accessor] ? <span className='fa fa-check' /> : <span className='fa fa-times' />
  ),
}

export default class SearchResults extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterColumn: PropTypes.func.isRequired,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    setOrderColumn: PropTypes.func.isRequired,
    toggleOrderDirection: PropTypes.func.isRequired,
  }

  filterColumnFactory = (column) => (e) => this.props.filterColumn(column)

  setOrderColumnFactory = (column) => (e) => this.props.setOrderColumn(column)

  toggleOrderDirection = (e) => this.props.toggleOrderDirection()

  render () {
    const { orderColumn, orderAscending } = this.props

    const columns = [
      {
        id: 'name',
        label: 'Name',
        accessor: 'name',
        display: 'verbatim',
      },
      {
        id: 'date',
        label: 'When?',
        accessor: 'date',
        display: 'datetime',
      },
      {
        id: 'active',
        label: 'Active?',
        accessor: 'active',
        display: 'boolean',
      },
    ]

    const results = [
      {
        uuid: 'f7a7881f-048b-46ef-8290-6153472f2e3a',
        name: 'Bob Grundy',
        date: '2017-11-30T15:18:21',
        active: true,
      },
      {
        uuid: 'd337a7a8-965b-4bc3-b1a6-8c2536ef26b0',
        name: 'Alice Wolf',
        date: '2017-12-25T12:01:48',
        active: false,
      },
    ]

    return (
      <div className='content__list'>
        <table className='table table--clickable table--admin-mobile-view'>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>
                  <span onClick={(orderColumn === column.id) ? this.toggleOrderDirection : this.setOrderColumnFactory(column.id)}>
                    {column.label}
                  </span>

                  <button className='btn btn--transparent' onClick={this.filterColumnFactory(column.id)}><Icon icon='filter' /></button>

                  {(orderColumn === column.id) && (
                    <button className='btn btn--transparent' onClick={this.toggleOrderDirection}>
                      { orderAscending ? (
                        <Icon icon='sort-asc' />
                      ) : (
                        <Icon icon='sort-desc' />
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.uuid} onClick={this.viewItem}>
                {columns.map((column) => (
                  <td data-header={column.label} key={column.id}>
                    {columnDisplayTypes[column.display](item, column.accessor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
