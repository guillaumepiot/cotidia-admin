import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../utils/resultItems'

// Normally we wouldn't bother with perf optimisation, but this takes a render of 250 items down
// from 130ms to 25-30ms when only one of the items changes (e.g. select an item).
export default class ResultsTableItem extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    checkItem: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.object,
    item: PropTypes.object.isRequired,
    showCheck: PropTypes.bool.isRequired,
    viewItem: PropTypes.func.isRequired,
  }

  handleClickRow = (e) => {
    if (this.props.viewItem) {
      this.props.viewItem(this.props.item, e.metaKey || e.ctrlKey || e.shiftKey)
    } else if (this.props.showCheck) {
      this.props.checkItem(this.props.item)
    }
  }

  checkItem = (e) => {
    e.stopPropagation()
    this.props.checkItem(this.props.item)
  }

  render () {
    const {
      checked,
      columns,
      config,
      item,
      showCheck,
    } = this.props

    const formatValue = getValueFormatter(config)

    return (
      <tr className={checked ? 'table__row--active' : null} onClick={this.handleClickRow}>
        {showCheck && (
          <td onClick={this.checkItem}>
            <input type='checkbox' checked={checked} />
          </td>
        )}
        {columns.map((column) => {
          if (column.type === 'data') {
            return (
              <td data-header={column.label} key={column.id}>
                {formatValue(item, column.accessor, column.display, column.listHandling)}
              </td>
            )
          } else if (column.type === 'separator') {
            return (
              <td
                className='table-column--separator'
                key={column.id}
              />
            )
          }
        })}
      </tr>
    )
  }
}
