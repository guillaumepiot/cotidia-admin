import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Suggest from '../common/Suggest'

export default class SuggestSingle extends Component {
  static propTypes = {
    cacheFilterLabel: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    suggest: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: '',
  }

  render () {
    return (
      <Suggest {...this.props} />
    )
  }
}
