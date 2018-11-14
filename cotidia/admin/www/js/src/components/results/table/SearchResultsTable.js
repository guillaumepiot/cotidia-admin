import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../../../utils/resultItems'

import ResultsTableHeader from '../../../containers/results/table/ResultsTableHeader'
import ResultsTableFooter from '../../../containers/results/table/ResultsTableFooter'
import ResultsTableItem from '../../../containers/results/table/ResultsTableItem'

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

  tableRef = React.createRef()

  componentDidUpdate (prevProps) {
    if (prevProps.results !== this.props.results) {
      this.tableRef.current.parentElement.scrollTop = 0
    }
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

    const tableClassName = [
      'table',
      'table--sticky',
      'table--admin-mobile-view',
    ]

    if (detailURL) {
      tableClassName.push('table--clickable')
    }

    if (loading) {
      tableClassName.push('table--loading')
    }

    if (hasBatchActions) {
      tableClassName.push('table--action')
    }

    if (config.tableStriped) {
      tableClassName.push('table--striped')
    }

    return (
      <table className={tableClassName.join(' ')} ref={this.tableRef}>
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
