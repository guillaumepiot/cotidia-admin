import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ManageColumns extends Component {
  static propTypes = {
    columns: PropTypes.object.isRequired,
    toggleColumn: PropTypes.func.isRequired,
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  toggleColumnFactory = (column) => (e) => this.props.toggleColumn(column)

  render () {
    const { columns, visibleColumns } = this.props

    return (
      <div className='form__group'>
        <div className='form__control'>
          <ul>
            {Object.entries(columns).map(([column, config]) => (
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
      </div>
    )
  }
}
