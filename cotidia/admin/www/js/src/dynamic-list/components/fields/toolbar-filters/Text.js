import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Text extends Component {
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
        extraGroupClasses={['form__group--boxed']}
        name={this.props.name}
        label={this.props.label}
        placeholder={this.props.label}
        updateValue={this.updateValue}
        updateValueOnEnter
        value={this.props.value}
      />
    )
  }
}
