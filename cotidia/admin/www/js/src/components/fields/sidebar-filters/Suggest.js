import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getFilterLabel } from '../../../utils'

import Suggest from '../common/Suggest'

export default class SuggestMultiple extends Component {
  static propTypes = {
    cacheFilterLabel: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired, // Used in getFilterLabel
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    suggest: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.array,
  }

  static defaultProps = {
    value: [],
  }

  updateValue = (value) => this.props.updateValue(value)

  render () {
    const values = this.props.value.map(
      (value) => ({
        value,
        // Blank config for now as we don't receive it. Only *really* used for dates anyway.
        label: getFilterLabel(this.props, this.props.name, value, {}),
      })
    )

    return (
      <Suggest
        {...this.props}
        multiple
        updateValue={this.updateValue}
        values={values}
      />
    )
  }
}
