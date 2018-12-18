import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ManageColumns extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    columnConfiguration: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    const { columnConfiguration, columns, visibleColumns } = this.props

    return (
      <div className='form__group'>
        <div className='form__control'>
          <ul>
            {columns.map(({ label, columns }) => (
              <li key={label}>
                <strong>{label}</strong>
                <ul>
                  {columns.map((column) => (
                    <li key={column}>
                      <label>
                        <input
                          checked={visibleColumns.includes(column)}
                          className='form__checkbox'
                          onChange={this.toggleColumnFactory(column)}
                          type='checkbox'
                        />

                        {columnConfiguration[column]?.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <button className='btn btn--delete' onClick={this.resetColumns} type='button'>Reset selected columns to default</button>
      </div>
    )
  }
}
