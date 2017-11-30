import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Filter extends Component {
  static propTypes = {
    column: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render () {
    return (
      <div>Filtering {this.props.column}</div>
    )
  }
}
