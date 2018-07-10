import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { debounce } from '../utils'

import * as inlineFilters from './inline-filters'

import { TextInput } from '@cotidia/react-ui'

import { Icon } from './elements/global'

export default class ToolBar extends Component {
  static propTypes = {
    anyResultsSelected: PropTypes.bool.isRequired,
    batchActions: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string.isRequired,
      endpoint: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onComplete: PropTypes.func,
    })),
    clearFilters: PropTypes.func.isRequired,
    filters: PropTypes.object,
    globalActions: PropTypes.array,
    hasSidebar: PropTypes.bool.isRequired,
    performBatchAction: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    setFilterValue: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    toolbarFilters: PropTypes.array,
  }

  static defaultProps = {
    batchActions: [],
    filters: {},
    globalActions: [],
    mode: 'table',
    searchTerm: '',
    toolbarFilters: [],
  }

  state = {
    action: '',
  }

  toggleSidebar = () => this.props.toggleSidebar()

  updateSearchTerm = debounce(250, ({ searchTerm }) => this.props.setSearchTerm(searchTerm))

  updateFilterValueFactory = (filter) => (value) => this.props.setFilterValue(filter, value)

  clearSearchTerm = (e) => {
    this.props.clearFilters()
  }

  selectBatchAction = (e) => this.setState({ action: e.target.value })

  performSelectedBatchAction = () => {
    if (this.state.action && this.state.action.length) {
      this.props.performBatchAction(this.state.action)
    }
  }

  performBatchActionFactory = (action) => () => {
    this.props.performBatchAction(action)
  }

  renderSearchToolbar () {
    const {
      filters,
      searchTerm,
      toolbarFilters,
    } = this.props

    return (
      <>
        <div className='form__group form__group--boxed'>
          <TextInput
            controlOnly
            label='Search'
            name='searchTerm'
            placeholder='Search'
            prefix={<Icon icon='search' />}
            type='text'
            updateValue={this.updateSearchTerm}
            updateValueOnBlur={false}
            value={searchTerm}
          />
        </div>

        {toolbarFilters && toolbarFilters.map((filter) => {
          const { filter: type, ...filterProps } = filter

          let Component

          if (type === 'boolean') {
            Component = inlineFilters.Boolean
          } else if (type === 'text') {
            Component = inlineFilters.Text
          } else if (type === 'number') {
            Component = inlineFilters.Number
          } else if (type === 'date') {
            Component = inlineFilters.Date
          } else if (type === 'choice') {
            Component = inlineFilters.Choice
          }

          if (Component) {
            return (
              <div className='form__row' key={filterProps.name}>
                <Component
                  {...filterProps}
                  updateValue={this.updateFilterValueFactory(filter.name)}
                  value={filters[filter.name]}
                />
              </div>
            )
          }
        })}
      </>
    )
  }

  renderBatchActionToolbar () {
    const {
      batchActions,
    } = this.props

    if (batchActions.length < 3) {
      return batchActions.map((action) => (
        <div className='content-filter__item' key={action.action}>
          <button
            className='btn btn--outline'
            onClick={this.performBatchActionFactory(action.action)}
            title={action.label}
            type='button'
          >
            {action.label}
          </button>
        </div>
      ))
    } else {
      return (
        <>
          <div className='content-filter__item'>
            <div className='form__group form__group--boxed'>
              <div className='form__control form__control--select'>
                <select
                  className='form__select'
                  onChange={this.selectBatchAction}
                  value={this.state.action}
                >
                  <option value=''>Choose an action</option>

                  {batchActions.map((action) => (
                    <option key={action.action} value={action.action}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='content-filter__item'>
            <button
              className='btn btn--outline'
              onClick={this.performSelectedBatchAction}
              type='button'
            >
              Go
            </button>
          </div>
        </>
      )
    }
  }

  render () {
    const {
      anyResultsSelected,
      hasSidebar,
    } = this.props

    return (
      <div className='content__toolbar'>
        <div className='content__filter'>
          {anyResultsSelected ? this.renderBatchActionToolbar() : this.renderSearchToolbar()}
        </div>

        <div className='content__actions'>
          <button className='btn btn--outline btn--small' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
            <Icon icon='sync-alt' />
          </button>

          {hasSidebar && (
            <button className='btn btn--outline btn--small' onClick={this.toggleSidebar}>
              <Icon icon='filter' />
            </button>
          )}
        </div>
      </div>
    )
  }
}
