import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Text from '../filters/Text'
import Choice from '../filters/Choice'
import Boolean from '../filters/Boolean'

export default class Filter extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    setFilterValue: PropTypes.func.isRequired,
  }

  render () {
    const { config: { filter } } = this.props

    let Component = Text

    switch (filter) {
      case 'choice':
        Component = Choice
        break

      case 'boolean':
        Component = Boolean
        break

      case 'text':
      default:
        Component = Text
    }

    return (
      <Component {...this.props} />
    )
  }
}
