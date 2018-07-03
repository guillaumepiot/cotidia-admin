import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Checkbox } from '@cotidia/react-ui'

export default class Boolean extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.bool,
  }

  static defaultProps = {
    value: false,
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)

  render () {
    return (
      <div className='form__group'>
        <Checkbox
          name={this.props.name}
          label={this.props.label}
          updateValue={this.updateValue}
          value={this.props.value}
        />
      </div>
    )
  }
}
