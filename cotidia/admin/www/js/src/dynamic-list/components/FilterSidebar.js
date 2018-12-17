import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { filterConfiguration } from '../utils/propTypes'

import { Icon } from './elements/global'

import * as SIDEBAR_FILTERS from './fields/sidebar-filters'

export default class FilterSidebar extends Component {
  static propTypes = {
    cacheFilterLabel: PropTypes.func.isRequired,
    filterConfiguration: filterConfiguration.isRequired,
    filters: PropTypes.object,
    getSuggestEngine: PropTypes.func.isRequired,
    hasSidebarFilters: PropTypes.bool.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    sidebarFilters: PropTypes.array,
    showSidebar: PropTypes.func.isRequired,
  }

  state = {
    expandedFilterGroups: this.props.sidebarFilters
      ? this.props.sidebarFilters.reduce((agg, filterOrGroup) => {
        if (filterOrGroup.filters && filterOrGroup.defaultOpen) {
          agg.push(filterOrGroup.name)
        }

        return agg
      }, [])
      : [],
  }

  updateFilterValueFactory = (filter) => (value) => this.props.setFilterValue(filter, value)

  hideSidebar = () => this.props.showSidebar(false)

  toggleFilterGroup = (group) => this.setState(({ expandedFilterGroups }) => ({
    expandedFilterGroups: expandedFilterGroups.includes(group)
      ? expandedFilterGroups.filter((expandedFilterGroup) => expandedFilterGroup !== group)
      : [ ...expandedFilterGroups, group ],
  }))

  renderFilterOrGroup = (filterOrGroup) => {
    if (filterOrGroup.filters) {
      return this.renderFilterGroup(filterOrGroup)
    } else {
      return this.renderFilter(filterOrGroup)
    }
  }

  renderFilterGroup = (group) => {
    return (
      <div
        className={`filter-section ${this.state.expandedFilterGroups.includes(group.name) ? 'filter-section--open' : ''}`}
        key={group.name}
      >
        <div className='form__legend filter-section__title'>
          {group.title}

          <button
            className='btn btn--link btn--small filter-section__expand'
            onClick={() => this.toggleFilterGroup(group.name)}
            type='button'
          >
            <Icon icon='chevron-down' />
          </button>
        </div>
        <fieldset className='filter-section__content'>
          {group.filters && group.filters.map(this.renderFilterOrGroup)}
        </fieldset>
      </div>
    )
  }

  renderFilter = (filter) => {
    const {
      cacheFilterLabel,
      filterConfiguration,
      filters,
      getSuggestEngine,
    } = this.props

    const {
      configuration,
      filter: type,
      label,
      name,
    } = filter

    let Component

    if (type === 'boolean') {
      Component = SIDEBAR_FILTERS.Boolean
    } else if (type === 'text') {
      Component = SIDEBAR_FILTERS.Text
    } else if (type === 'number') {
      Component = SIDEBAR_FILTERS.Number
    } else if (type === 'date') {
      Component = SIDEBAR_FILTERS.Date
    } else if (type === 'choice') {
      if (configuration.mode === 'options') {
        Component = SIDEBAR_FILTERS.Choice
      } else {
        Component = SIDEBAR_FILTERS.Suggest
      }
    } else if (type === 'choice-single') {
      if (configuration.mode === 'options') {
        Component = SIDEBAR_FILTERS.ChoiceSingle
      } else {
        Component = SIDEBAR_FILTERS.SuggestSingle
      }
    }

    if (Component) {
      return (
        <div className='form__row' key={filter.name}>
          <Component
            cacheFilterLabel={cacheFilterLabel}
            configuration={configuration}
            filter={type}
            label={label}
            name={name}
            suggest={getSuggestEngine(filter.configuration, filterConfiguration)}
            updateValue={this.updateFilterValueFactory(filter.name)}
            value={filters[filter.name]}
          />
        </div>
      )
    }
  }

  render () {
    const {
      hasSidebarFilters,
      sidebarFilters,
    } = this.props

    if (! (hasSidebarFilters && sidebarFilters?.length)) {
      return null
    }

    return (
      <div className='content__sidebar'>
        <form action='' className='form--animate'>
          <fieldset>
            <div className='form__legend sidebar-title'>
              Filter

              <button
                className='btn btn--link btn--small toggle-sidebar'
                onClick={this.hideSidebar}
                type='button'
              >
                <Icon icon='times' />
              </button>
            </div>

            {sidebarFilters && sidebarFilters.map(this.renderFilterOrGroup)}
          </fieldset>
        </form>
      </div>
    )
  }
}
