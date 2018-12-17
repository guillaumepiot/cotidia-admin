import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Select } from '@cotidia/react-ui'

export default class Choice extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.any,
    updateValue: PropTypes.func.isRequired,
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)

  render () {
    const {
      name,
      options,
      value,
    } = this.props

    return (
      <Select
        name={name}
        updateValue={this.updateValue}
        options={options}
        value={value}
      />
    )
  }
}
