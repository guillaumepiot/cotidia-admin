import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
  }

  updateFilterValueFactory = (filter) => (value) => this.props.setFilterValue(filter, value)

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
            <legend>Filter</legend>

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
                  <Component {...filterProps}
                    key={filterProps.name}
                    updateValue={this.updateFilterValueFactory(filter.name)}
                    value={filters[filter.name]}
                  />
                )
              }
            })}

            {/* <div className='form__row'>
              <div className='form__group'>
                <label className='form__label'>Job number</label>
                <div className='form__control form__control--input'>
                  <input type='text' name='first_name' placeholder='Frank Green' />
                </div>
                <div className='form__help' />
              </div>
            </div>
            <div className='form__row'>
              <div className='form__group'>
                <label className='form__label'>Status</label>
                <div className='form__control form__control--select'>
                  <select className='form__select'>
                    <option className='' />
                    <option className='A'>Active</option>
                    <option className='B'>Archived</option>
                    <option className='C'>Pending</option>
                  </select>
                </div>
                <div className='form__help' />
              </div>
            </div> */}
          </fieldset>
        </form>
      </div>
    )
  }
}
