import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { debounce } from '../utils'

import { Boolean } from './inline-filters'

import { TextInput } from '@cotidia/react-ui'

import { Icon } from './elements/global'

export default class ToolBar extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string.isRequired,
      endpoint: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onComplete: PropTypes.func,
    })),
    clearFilters: PropTypes.func.isRequired,
    extraFilters: PropTypes.object,
    filters: PropTypes.object,
    globalActions: PropTypes.array,
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

  renderBatchActions () {
    const { batchActions } = this.props

    if (batchActions.length === 1) {
      return batchActions.map((action) => (
        <button
          className='btn btn--outline'
          key={action.action}
          onClick={this.performBatchActionFactory(action.action)}
          title={action.label}
          type='button'
        >
          {action.label}
        </button>
      ))
    } else if (batchActions.length > 1) {
      return (
        <div className='form__control'>
          <select className='form__select' onChange={this.selectBatchAction} value={this.state.action}>
            <option value=''>Choose an action</option>
            { batchActions.map((action) => (
              <option key={action.action} value={action.action}>
                {action.label}
              </option>
            )) }
          </select>
          <button onClick={this.performSelectedBatchAction} type='button'>Go</button>
        </div>
      )
    }
  }

  render () {
    const {
      extraFilters,
      filters,
      searchTerm,
      toolbarFilters,
    } = this.props

    return (
      <div className='content__toolbar'>
        <div className='content__filter'>
          <TextInput
            controlOnly
            label='Search'
            name='searchTerm'
            prefix={<Icon icon='search' />}
            type='text'
            updateValue={this.updateSearchTerm}
            updateValueOnBlur={false}
            value={searchTerm}
          />

          {toolbarFilters && toolbarFilters.map((filter) => {
            const { filter: type, ...filterProps } = extraFilters[filter]

            if (type === 'boolean') {
              return (
                <Boolean
                  key={filter}
                  {...filterProps}
                  name={filter}
                  updateValue={this.updateFilterValueFactory(filter)}
                  value={filters[filter]}
                />
              )
            }
          })}
        </div>

        <div className='content__actions'>
          <button className='btn btn--outline btn--small' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
            <Icon icon='sync-alt' />
          </button>

          {this.renderBatchActions()}

          <button className='btn btn--outline btn--small' onClick={this.toggleSidebar}>
            <Icon icon='filter' />
          </button>
        </div>
      </div>
    )
  }
}
