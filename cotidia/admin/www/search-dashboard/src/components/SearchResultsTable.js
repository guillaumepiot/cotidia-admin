import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { generateURL } from '../utils/api'
import { getItemValue, getFormattedValueWithConfig } from '../utils/resultItems'

import ResultsTableHeader from './ResultsTableHeader'
import ResultsTableItem from './ResultsTableItem'
import Pagination from '../containers/Pagination'

export default class SearchResultsTable extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.object),
    clearFilter: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.object,
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

  viewItem = (item, newWindow) => {
    if (this.props.detailURL) {
      const url = generateURL(this.props.detailURL, item)

      if (newWindow) {
        window.open(url)
      } else {
        window.location = url
      }
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
      config,
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

    let currentCategoryValue = null
    let formatter = null

    if (config.categoriseBy) {
      formatter = getFormattedValueWithConfig(config)
    }

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
            {results.map((item) => {
              if (config.categoriseBy) {
                let itemValue = getItemValue(item, config.categoriseBy.column)

                if (Array.isArray(itemValue)) {
                  itemValue = itemValue[0]
                }

                if (itemValue !== currentCategoryValue) {
                  currentCategoryValue = itemValue

                  const formattedValue = formatter(
                    item,
                    config.categoriseBy.column,
                    config.categoriseBy.display
                  )

                  return [
                    (
                      <tr className='category-header'>
                        <td colSpan={columns.length + (batchActions.length > 0 ? 1 : 0)}>
                          {formattedValue}
                        </td>
                      </tr>
                    ),
                    (
                      <ResultsTableItem
                        checked={selected.includes(item.uuid)}
                        checkItem={this.checkItem}
                        columns={columns}
                        config={config}
                        key={item.uuid}
                        item={item}
                        showCheck={batchActions.length > 0}
                        viewItem={detailURL ? this.viewItem : null}
                      />
                    ),
                  ]
                }
              }

              return (
                <ResultsTableItem
                  checked={selected.includes(item.uuid)}
                  checkItem={this.checkItem}
                  columns={columns}
                  config={config}
                  key={item.uuid}
                  item={item}
                  showCheck={batchActions.length > 0}
                  viewItem={detailURL ? this.viewItem : null}
                />
              )
            })}
          </tbody>
        </table>

        <Pagination />
      </>
    )
  }
}
