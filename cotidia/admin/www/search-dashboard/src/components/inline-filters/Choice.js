import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Select } from '@cotidia/react-ui'

export default class Choice extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)

  render () {
    return (
      <Select
        name={this.props.name}
        label={this.props.label}
        options={this.props.options}
        updateValue={this.updateValue}
        value={this.props.value}
      />
    )
  }
}
