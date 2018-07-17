import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../utils/resultItems'

export default class ResultsTableFooter extends Component {
  static propTypes = {
    batchActions: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.object,
    results: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    batchActions: [],
  }

  getSum (column) {
    return this.props.results.reduce((agg, item) => {
      // Ignore null/undefined values
      if (item[column] != null) {
        agg += item[column]
      }

      return agg
    }, 0)
  }

  getAvg (column) {
    // Rather than relying on actual array count, we keep a running total of the items we actually
    // use (as some may be null/undefined) so we can create the average correctly.
    let count = 0

    return this.props.results.reduce((agg, item) => {
      // Ignore null/undefined values
      if (item[column] != null) {
        agg += item[column]
        count++
      }

      return agg
    }, 0) / count
  }

  render () {
    const {
      batchActions,
      columns,
      config,
    } = this.props

    if (! columns.find((column) => column.footer)) {
      return null
    }

    const formatValue = getValueFormatter(config)

    return (
      <tfoot>
        <tr>
          {(batchActions.length > 0) && (
            <th />
          )}
          {columns.map((column) => {
            let content = null

            if (column.footer) {
              if (column.footer === 'sum') {
                content = this.getSum(column.accessor)
              } else if (column.footer === 'avg') {
                content = this.getAvg(column.accessor)
              } else if (column.footer.startsWith('text:')) {
                content = column.footer.slice(5)
              }

              const fakeItem = {
                [column.accessor]: content,
              }

              content = formatValue(fakeItem, column.accessor, column.display, column.listHandling)
            }

            return (
              <th key={column.id}>
                {content}
              </th>
            )
          })}
        </tr>
      </tfoot>
    )
  }
}
