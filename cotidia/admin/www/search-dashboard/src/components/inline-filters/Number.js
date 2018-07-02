import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Number extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: '',
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)

  render () {
    return (
      <TextInput
        name={this.props.name}
        label={this.props.label}
        type='number'
        updateValue={this.updateValue}
        value={this.props.value}
      />
    )
  }
}
