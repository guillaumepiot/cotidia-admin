import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../utils/resultItems'

import ResultsTableHeader from '../containers/ResultsTableHeader'
import ResultsTableFooter from '../containers/ResultsTableFooter'
import ResultsTableItem from '../containers/ResultsTableItem'

export default class SearchResultsTable extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.object),
    categoriseBy: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.object,
    detailURL: PropTypes.string,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    batchActions: [],
    loading: false,
    selected: [],
  }

  render () {
    const {
      batchActions,
      categoriseBy,
      columns,
      config,
      detailURL,
      loading,
      results,
    } = this.props

    let currentCategoryValue = null
    let formatValue = null

    if (categoriseBy) {
      formatValue = getValueFormatter(config)
    }

    return (
      <table className={`table table--sticky ${detailURL ? 'table--clickable' : ''} ${loading ? 'table--loading' : ''}`}>
        <ResultsTableHeader />
        <ResultsTableFooter />
        <tbody>
          {results.map((item) => {
            if (categoriseBy) {
              let itemValue = item[categoriseBy.column]

              if (Array.isArray(itemValue)) {
                itemValue = itemValue[0]
              }

              if (itemValue !== currentCategoryValue) {
                currentCategoryValue = itemValue

                const formattedValue = formatValue(
                  item,
                  categoriseBy.column,
                  categoriseBy.display
                )

                return [
                  (
                    <tr key={formattedValue} className='table__category-header'>
                      <td colSpan={columns.length + (batchActions.length > 0 ? 1 : 0)}>
                        {formattedValue}
                      </td>
                    </tr>
                  ),
                  (
                    <ResultsTableItem key={item.uuid} item={item} />
                  ),
                ]
              }
            }

            return (
              <ResultsTableItem key={item.uuid} item={item} />
            )
          })}
        </tbody>
      </table>
    )
  }
}
