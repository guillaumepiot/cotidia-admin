import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { DatePickerInput } from '@cotidia/react-ui'

export default class Date extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    updateValue: PropTypes.func.isRequired,
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)

  render () {
    const {
      name,
      value,
    } = this.props

    return (
      <DatePickerInput
        name={name}
        updateValue={this.updateValue}
        value={value}
      />
    )
  }
}
