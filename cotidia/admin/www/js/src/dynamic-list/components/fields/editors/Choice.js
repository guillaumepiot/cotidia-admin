import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MultipleSelect } from '@cotidia/react-ui'

export default class Choice extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.any,
    updateValue: PropTypes.func.isRequired,
  }

  updateValue = ({ [this.props.name]: value }) =>
    this.props.updateValue(value.map((item) => item.value))

  render () {
    const { name, options, value } = this.props

    const values = value.map((value) => options.find((item) => item.value === value))

    return (
      <MultipleSelect
        name={name}
        options={options}
        updateValue={this.updateValue}
        values={values}
      />
    )
  }
}
