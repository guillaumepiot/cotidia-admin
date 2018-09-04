import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Select } from '@cotidia/react-ui'

export default class ChoiceSingle extends Component {
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

  static defaultProps = {
    value: '',
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)

  render () {
    return (
      <div className='form__group form__group--boxed'>
        <Select
          controlOnly
          label={this.props.label}
          name={this.props.name}
          options={this.props.options}
          updateValue={this.updateValue}
          value={this.props.value}
        />
      </div>
    )
  }
}
