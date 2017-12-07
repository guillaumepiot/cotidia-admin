import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Boolean extends Component {
  static propTypes = {
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.boolean,
    }).isRequired,
    filter: PropTypes.string.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
  }

  updateValueFactory = (value) => () => this.props.updateField('value', value)

  setFilterValue = (e) => this.props.setFilterValue(this.props.filter, this.state.value)

  render () {
    return (
      <div className='form__group'>
        <label className='form__label'>{this.props.config.label} is</label>
        <div className='form__control'>
          <ul>
            <li>
              <label>
                <input
                  checked={this.props.data.value === true}
                  className='form__checkbox'
                  onChange={this.updateValueFactory(true)}
                  type='radio'
                />

                Yes
              </label>
            </li>
            <li>
              <label>
                <input
                  checked={this.props.data.value === false}
                  className='form__checkbox'
                  onChange={this.updateValueFactory(false)}
                  type='radio'
                />

                No
              </label>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
