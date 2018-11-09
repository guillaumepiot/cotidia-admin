import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MultipleSelect } from '@cotidia/react-ui'

export default class Choice extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    configuration: PropTypes.shape({
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    value: [],
  }

  updateValue = (data) => {
    const values = data[this.props.name]

    // Just get the `value` attribute of the value objects that are passed in,
    // and send them up the chain.
    return this.props.updateValue(values.map(({ value }) => value))
  }

  render () {
    // Reconstruct the array of value objects from just our array of values.
    const values = this.props.value?.map(
      (value) => this.props.configuration.options.find((option) => option.value === value)
    ) || []

    return (
      <div className='form__group form__group--boxed'>
        <MultipleSelect
          controlOnly
          displaySelections={false}
          name={this.props.name}
          label={this.props.label}
          options={this.props.configuration.options}
          placeholder={this.props.label}
          updateValue={this.updateValue}
          values={values}
        />
      </div>
    )
  }
}
