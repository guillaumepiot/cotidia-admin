import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Filter extends Component {
  static propTypes = {
    componentProps: PropTypes.object,
    componentReference: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    setTitle: PropTypes.func,
  }

  render () {
    const {
      componentProps,
      componentReference,
      item,
      setTitle,
    } = this.props

    const Component = window[componentReference]

    return (
      <Component {...componentProps} item={item} setTitle={setTitle} />
    )
  }
}
