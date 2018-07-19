import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MultipleSelect } from '@cotidia/react-ui'

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

  handleMultipleSelectUpdate = ({ filterValue }) => {
    // Just get the `value` attribute of the value objects that are passed in,
    // and send them up the chain.
    return this.props.updateField('value', filterValue.map(({ value }) => value))
  }

  render () {
    const { config, data } = this.props

    return (
      <div className='form__group'>
        <label className='form__label'>{config.label} is any of</label>
        <div className='form__control'>
          {config.options.length < 15
            ? (
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
            ) : (
              <MultipleSelect
                name='filterValue'
                options={config.options}
                updateValue={this.handleMultipleSelectUpdate}
                values={data.value?.map(
                  (value) => config.options.find((option) => option.value === value)
                ) || []}
              />
            )
          }
        </div>
      </div>
    )
  }
}
