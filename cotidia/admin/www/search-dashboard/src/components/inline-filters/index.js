import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Checkbox } from '@cotidia/react-ui'

export class Boolean extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.bool,
    field: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: false,
  }

  updateValue = ({ [this.props.field]: value }) => this.props.updateValue(value)

  render () {
    return (
      <Checkbox
        name={this.props.field}
        label={this.props.label}
        updateValue={this.updateValue}
        value={this.props.value}
      />
    )
  }
}
