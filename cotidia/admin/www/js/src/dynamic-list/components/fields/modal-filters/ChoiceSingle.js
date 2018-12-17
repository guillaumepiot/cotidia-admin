import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Select } from '@cotidia/react-ui'

export default class ChoiceSingle extends Component {
  static propTypes = {
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
      configuration: PropTypes.shape({
        options: PropTypes.arrayOf(PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        })).isRequired,
      }).isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
    updateField: PropTypes.func.isRequired,
  }

  setValueFactory = (value) => () => this.props.updateField('value', value)

  updateValue = ({ value }) => this.props.updateField('value', value)

  render () {
    const { config, data } = this.props

    return (
      <div className='form__group'>
        <label className='form__label'>{config.label} is</label>
        <div className='form__control'>
          {config.configuration.options.length < 15
            ? (
              <ul>
                {config.configuration.options.map(({ label, value }) => (
                  <li key={value}>
                    <label>
                      <input
                        checked={data.value === value}
                        className='form__checkbox'
                        onChange={this.setValueFactory(value)}
                        type='radio'
                      />

                      {label}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <Select
                name='value'
                options={config.configuration.options}
                updateValue={this.updateValue}
                value={data.value || ''}
              />
            )
          }
        </div>
      </div>
    )
  }
}
