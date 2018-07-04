import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

import Boolean from './inline-filters/Boolean'
import Text from './inline-filters/Text'
import Number from './inline-filters/Number'
import Date from './inline-filters/Date'
import Choice from './inline-filters/Choice'

export default class FilterSidebar extends Component {
  static propTypes = {
    filters: PropTypes.object,
    hasSidebarFilters: PropTypes.bool.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    sidebarFilters: PropTypes.array,
    showSidebar: PropTypes.func.isRequired,
  }

  updateFilterValueFactory = (filter) => (value) => this.props.setFilterValue(filter, value)

  hideSidebar = () => this.props.showSidebar(false)

  render () {
    const {
      filters,
      hasSidebarFilters,
      sidebarFilters,
    } = this.props

    if (! hasSidebarFilters) {
      return null
    }

    return (
      <div className='content__sidebar'>
        <form action='' className='form--animate'>
          <fieldset>
            <div className='form__legend'>
              Filter

              <button className='btn btn--link btn--small toggle-sidebar' type='button' onClick={this.hideSidebar}>
                <Icon icon='times' />
              </button>
            </div>

            {sidebarFilters && sidebarFilters.map((filter) => {
              const { filter: type, ...filterProps } = filter

              let Component

              if (type === 'boolean') {
                Component = Boolean
              } else if (type === 'text') {
                Component = Text
              } else if (type === 'number') {
                Component = Number
              } else if (type === 'date') {
                Component = Date
              } else if (type === 'choice') {
                Component = Choice
              }

              if (Component) {
                return (
                  <div className='form__row' key={filterProps.name}>
                    <Component {...filterProps}
                      updateValue={this.updateFilterValueFactory(filter.name)}
                      value={filters[filter.name]}
                    />
                  </div>
                )
              }
            })}
          </fieldset>
        </form>
      </div>
    )
  }
}
