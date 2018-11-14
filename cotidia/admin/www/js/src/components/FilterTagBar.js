import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getFilterLabel } from '../utils'

import { filterConfiguration } from '../utils/propTypes'

import { Icon } from './elements/global'

export default class FilterTagBar extends Component {
  static propTypes = {
    config: PropTypes.object,
    filterConfiguration: filterConfiguration.isRequired,
    filters: PropTypes.object,
    removeFilterValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    filters: {},
  }

  renderFilterTag = (filter, value) => {
    // If the filter doesn't exist, skip it.
    if (! this.props.filterConfiguration[filter]) {
      return
    }

    // If the value is the equivalent of "unset", skip it.
    if (value == null) {
      return
    }

    let filterName = this.props.filterConfiguration[filter].label

    let filterLabel = getFilterLabel(
      this.props.filterConfiguration[filter],
      filter,
      value,
      this.props.config
    )

    // If there's no label, that means we should show the name as the label and not show the name.
    if (filterLabel === null) {
      filterLabel = filterName
      filterName = null
    }

    let serialisedValue = value

    if (value.min && value.max) {
      serialisedValue = `${value.min}-${value.max}`
    }

    return (
      <div className='tag' key={`${filter}:${serialisedValue}`}>
        {filterName && (
          <span className='tag__category'>{filterName}</span>
        )}
        {filterLabel && (
          <span className='tag__label'>{filterLabel}</span>
        )}
        <button
          className='tag__clear btn btn--small'
          onClick={() => this.props.removeFilterValue(filter, value)}
          type='button'
        >
          <Icon icon='times' />
        </button>
      </div>
    )
  }

  render () {
    const { filters } = this.props

    if (Object.values(filters).length == 0) {
      return null
    }

    return (
      <div className='content__filters'>
        {Object.entries(filters).map(([filter, value]) => {
          if (Array.isArray(value)) {
            const tags = []

            for (const singleValue of value) {
              tags.push(this.renderFilterTag(filter, singleValue))
            }

            return tags
          }

          return this.renderFilterTag(filter, value)
        })}
      </div>
    )
  }
}
