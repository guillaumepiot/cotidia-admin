import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { generateURL } from '../utils/api'

import ResultsTableHeader from './ResultsTableHeader'
import ResultsTableItem from './ResultsTableItem'
import Pagination from '../containers/Pagination'

export default class SearchResults extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.object),
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    detailURL: PropTypes.string,
    filterColumn: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    loading: PropTypes.bool,
    orderAscending: PropTypes.bool.isRequired,
    orderColumn: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.arrayOf(PropTypes.string),
    setOrderColumn: PropTypes.func.isRequired,
    toggleOrderDirection: PropTypes.func.isRequired,
    toggleResultSelected: PropTypes.func.isRequired,
    toggleSelectAllResults: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchActions: [],
    loading: false,
    selected: [],
  }

  viewItem = (item) => {
    if (this.props.detailURL) {
      window.location = generateURL(this.props.detailURL, item)
    }
  }

  checkItem = (item) => this.props.toggleResultSelected(item.uuid)

  allSelected () {
    return (this.props.results.length && (this.props.selected.length === this.props.results.length)) || false
  }

  render () {
    const {
      batchActions,
      clearFilter,
      columns,
      detailURL,
      filterColumn,
      filters,
      loading,
      orderColumn,
      orderAscending,
      results,
      selected,
      setOrderColumn,
      toggleOrderDirection,
      toggleSelectAllResults,
    } = this.props

    return (
      <>
        <table className={`table ${detailURL ? 'table--clickable' : ''} table--admin-mobile-view ${loading ? 'table--loading' : ''}`}>
          <ResultsTableHeader
            allSelected={this.allSelected()}
            batchActions={batchActions}
            columns={columns}
            filters={filters}
            orderAscending={orderAscending}
            orderColumn={orderColumn}
            clearFilter={clearFilter}
            filterColumn={filterColumn}
            setOrderColumn={setOrderColumn}
            toggleSelectAllResults={toggleSelectAllResults}
            toggleOrderDirection={toggleOrderDirection}
          />
          <tbody>
            {results.map((item) => (
              <ResultsTableItem
                key={item.uuid}
                checked={selected.includes(item.uuid)}
                checkItem={this.checkItem}
                columns={columns}
                item={item}
                showCheck={batchActions.length > 0}
                viewItem={this.viewItem}
              />
            ))}
          </tbody>
        </table>

        <Pagination />
      </>
    )
  }
}
