import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Text from '../filters/Text'
import Choice from '../filters/Choice'
import Boolean from '../filters/Boolean'
import Number from '../filters/Number'
import Date from '../filters/Date'

export default class Filter extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    globalConfig: PropTypes.object,
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

      case 'number':
        Component = Number
        break

      case 'date':
        Component = Date
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
