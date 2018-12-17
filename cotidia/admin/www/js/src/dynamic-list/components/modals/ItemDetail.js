import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Filter extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    componentProps: PropTypes.object,
    componentReference: PropTypes.string.isRequired,
  }

  render () {
    const {
      componentProps,
      componentReference,
      item,
    } = this.props

    const Component = window[componentReference]

    return (
      <Component {...componentProps} item={item} />
    )
  }
}
