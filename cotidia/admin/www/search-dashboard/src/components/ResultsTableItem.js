import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { generateURL } from '../utils/api'
import { getValueFormatter } from '../utils/resultItems'

// Normally we wouldn't bother with perf optimisation, but this takes a render of 250 items down
// from 130ms to 25-30ms when only one of the items changes (e.g. select an item).
export default class ResultsTableItem extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.object,
    detailURL: PropTypes.string,
    item: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    showCheck: PropTypes.bool.isRequired,
    toggleResultSelected: PropTypes.func.isRequired,
  }

  handleClickRow = (e) => {
    if (this.props.detailURL) {
      this.viewItem(e.metaKey || e.ctrlKey || e.shiftKey)
    } else if (this.props.showCheck) {
      this.checkItem()
    }
  }

  viewItem = (newWindow = false) => {
    const url = generateURL(this.props.detailURL, this.props.item)

    if (newWindow) {
      window.open(url)
    } else {
      window.location = url
    }
  }

  checkItem = (e) => {
    e && e.stopPropagation()

    this.props.toggleResultSelected(this.props.item.uuid)
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
