import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ManageColumns extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    // TODO: Change this to use columns when we have it coming in.
    columnConfiguration: PropTypes.object.isRequired,
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
    const { columnConfiguration, visibleColumns } = this.props

    const orderedColumns = Object.entries(columnConfiguration)
      .sort((a, b) => a[1].label.localeCompare(b[1].label))

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
        <button className='btn btn--delete' onClick={this.resetColumns} type='button'>Reset selected columns to default</button>
      </div>
    )
  }
}
