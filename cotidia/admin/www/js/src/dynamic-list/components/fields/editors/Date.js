import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { DatePickerInput } from '@cotidia/react-ui'

export default class Date extends Component {
  static propTypes = {
    config: PropTypes.shape({
      weekDayStart: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
    }),
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
        dropdownAnchor='right'
        name={name}
        updateValue={this.updateValue}
        value={value}
        weekDayStart={this.props.config.weekDayStart ?? 1}
      />
    )
  }
}
