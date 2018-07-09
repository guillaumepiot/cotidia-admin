import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../utils/resultItems'

import ResultsTableHeader from '../containers/ResultsTableHeader'
import ResultsTableFooter from '../containers/ResultsTableFooter'
import ResultsTableItem from '../containers/ResultsTableItem'

const CATEGORY_ROW_COLSPAN = 3

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

    const hasBatchActions = batchActions.length > 0
    const categoryRowUnusedColspan = columns.length - CATEGORY_ROW_COLSPAN + (hasBatchActions ? 1 : 0)

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
                    <tr key={formattedValue}>
                      <td className='table-cell--category nowrap' colSpan={CATEGORY_ROW_COLSPAN}>
                        {formattedValue}
                      </td>
                      <td className='table-cell--category' colSpan={categoryRowUnusedColspan} />
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
