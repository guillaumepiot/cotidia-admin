import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Text extends Component {
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
      <TextInput
        name={name}
        updateValue={this.updateValue}
        updateValueOnBlur={false}
        value={value}
      />
    )
  }
}
