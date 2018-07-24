import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ManageColumns extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    columns: PropTypes.object.isRequired,
    resetColumns: PropTypes.func.isRequired,
    toggleColumn: PropTypes.func.isRequired,
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  toggleColumnFactory = (column) => (e) => this.props.toggleColumn(column)

  resetColumns = (e) => {
    this.props.resetColumns()
    this.props.closeModal()
  }

  render () {
    const { columns, visibleColumns } = this.props

    let orderedColumns = Object.entries(columns)
    orderedColumns.sort(([_, a], [__, b]) => a.label.localeCompare(b.label))

    return (
      <div className='form__group'>
        <div className='form__control'>
          <ul>
            {orderedColumns.map(([column, config]) => (
              <li key={column}>
                <label>
                  <input
                    checked={visibleColumns.includes(column)}
                    className='form__checkbox'
                    onChange={this.toggleColumnFactory(column)}
                    type='checkbox'
                  />

                  {config.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button className='btn btn--delete' onClick={this.resetColumns} type='button'>Reset columns to default</button>
      </div>
    )
  }
}
