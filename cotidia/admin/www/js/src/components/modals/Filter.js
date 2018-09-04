import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as MODAL_FILTERS from '../fields/modal-filters'

export default class Filter extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    globalConfig: PropTypes.object,
    setFilterValue: PropTypes.func.isRequired,
  }

  render () {
    const { config: { filter } } = this.props

    let Component

    switch (filter) {
      case 'choice':
        Component = MODAL_FILTERS.Choice
        break

      case 'choice-single':
        Component = MODAL_FILTERS.ChoiceSingle
        break

      case 'boolean':
        Component = MODAL_FILTERS.Boolean
        break

      case 'number':
        Component = MODAL_FILTERS.Number
        break

      case 'date':
        Component = MODAL_FILTERS.Date
        break

      case 'text':
      default:
        Component = MODAL_FILTERS.Text
    }

    return (
      <Component {...this.props} />
    )
  }
}
