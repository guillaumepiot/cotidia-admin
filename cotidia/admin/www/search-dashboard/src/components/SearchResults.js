import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { generateURL } from '../utils/api'

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
    detailURL: PropTypes.string,
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

  viewItemFactory = (item) => (e) => {
    if (this.props.detailURL) {
      window.location = generateURL(this.props.detailURL, item)
    }
  }

  render () {
    const {
      columns,
      detailURL,
      orderColumn,
      orderAscending,
      results,
    } = this.props

    return (
      <div className='content__list'>
        <table className={`table ${detailURL ? 'table--clickable' : ''} table--admin-mobile-view`}>
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
                    <button className='btn btn--transparent' onClick={this.filterColumnFactory(column.id)}><Icon icon='filter' /></button>
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
