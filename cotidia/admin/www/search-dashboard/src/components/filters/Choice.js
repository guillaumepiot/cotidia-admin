import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Choice extends Component {
  static propTypes = {
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })).isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    filter: PropTypes.string.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
  }

  toggleColumnFactory = (value) => (e) => {
    if (this.props.data.value) {
      if (this.props.data.value.includes(value)) {
        this.props.updateField('value', this.props.data.value.filter((item) => item !== value))
      } else {
        this.props.updateField('value', [ ...this.props.data.value, value ])
      }
    } else {
      this.props.updateField('value', [ value ])
    }
  }

  setFilterValue = (e) => this.props.setFilterValue(this.props.filter, this.state.value)

  render () {
    const { config, data } = this.props

    return (
      <div className='form__group'>
        <label className='form__label'>{config.label} is any of</label>
        <div className='form__control'>
          <ul>
            {config.options.map(({ label, value }) => (
              <li key={value}>
                <label>
                  <input
                    checked={Boolean(data.value && data.value.includes(value))}
                    className='form__checkbox'
                    onChange={this.toggleColumnFactory(value)}
                    type='checkbox'
                  />

                  {label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
