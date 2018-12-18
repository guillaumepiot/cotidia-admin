import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as MODAL_FILTERS from '../fields/modal-filters'

export default class Filter extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    filterConfiguration: PropTypes.object.isRequired,
    getSuggestEngine: PropTypes.func.isRequired,
    globalConfig: PropTypes.object,
    setFilterValue: PropTypes.func.isRequired,
  }

  render () {
    const { config: { configuration, filter } } = this.props

    let Component

    const { filterConfiguration, getSuggestEngine, ...props } = this.props

    switch (filter) {
      case 'choice':
        if (configuration.mode === 'options') {
          Component = MODAL_FILTERS.Choice
        } else {
          Component = MODAL_FILTERS.Suggest
          props.suggest = getSuggestEngine(configuration, filterConfiguration)
        }

        break

      case 'choice-single':
        if (configuration.mode === 'options') {
          Component = MODAL_FILTERS.ChoiceSingle
        } else {
          Component = MODAL_FILTERS.SuggestSingle
          props.suggest = getSuggestEngine(configuration, filterConfiguration)
        }

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
      <Component {...props} />
    )
  }
}
