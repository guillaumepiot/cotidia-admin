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
      <div className='form__group form__group--boxed'>
        <TextInput
          controlOnly
          name={this.props.name}
          label={this.props.label}
          placeholder={this.props.label}
          updateValue={this.updateValue}
          value={this.props.value}
        />
      </div>
    )
  }
}
