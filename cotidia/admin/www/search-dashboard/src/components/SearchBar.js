import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { debounce } from '../utils'

import { TextInput } from '@cotidia/react-ui'

import { Icon } from './elements/global'

export default class SearchBar extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string.isRequired,
      endpoint: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onComplete: PropTypes.func,
    })),
    clearFilters: PropTypes.func.isRequired,
    columnsConfigurable: PropTypes.bool.isRequired,
    globalActions: PropTypes.array,
    hasListConfig: PropTypes.bool.isRequired,
    manageColumns: PropTypes.func.isRequired,
    mode: PropTypes.string,
    performBatchAction: PropTypes.func.isRequired,
    performGlobalAction: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func.isRequired,
    switchMode: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchActions: [],
    globalActions: [],
  }

  state = {
    action: '',
  }

  displayList = () => {
    this.props.switchMode('list')
  }

  displayTable = () => {
    this.props.switchMode('table')
  }

  updateSearchTerm = debounce(250, ({ searchTerm }) => this.props.setSearchTerm(searchTerm))

  clearSearchTerm = (e) => {
    this.props.clearFilters()
  }

  manageColumns = (e) => {
    this.props.manageColumns()
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

  performGlobalActionFactory = (action) => () => {
    this.props.performGlobalAction(action)
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
      columnsConfigurable,
      globalActions,
      hasListConfig,
      mode,
      searchTerm,
    } = this.props

    return (
      <>
        {hasListConfig && (
          <div className='head-bar text-right'>
            <div style={{ flex: 1 }} />

            <button className={`btn ${mode === 'list' ? '' : 'btn--outline'}`} onClick={this.displayList}>
              <Icon fixed icon='bars' />
            </button>
            <button className={`btn ${mode === 'table' ? '' : 'btn--outline'}`} onClick={this.displayTable}>
              <Icon fixed icon='table' />
            </button>
          </div>
        )}
        <div className='head-bar head-bar--filter'>
          <TextInput
            label='Search'
            name='searchTerm'
            prefix={<Icon icon='search' />}
            type='text'
            updateValue={this.updateSearchTerm}
            updateValueOnBlur={false}
            value={searchTerm}
          />

          <button className='btn btn--outline' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
            <Icon fixed icon='sync-alt' />
          </button>

          {globalActions && globalActions.map((action) => (
            <button
              className='btn btn--outline'
              key={action.action}
              onClick={this.performGlobalActionFactory(action)}
              title={action.label}
              type='button'
            >
              {action.icon ? (
                <Icon fixed icon={action.icon} />
              ) : action.label}
            </button>
          ))}

          {columnsConfigurable && (
            <button className='btn btn--outline' onClick={this.manageColumns} title='Manage column' type='button'>
              <Icon fixed icon='columns' />
            </button>
          )}

          {this.renderBatchActions()}
        </div>
      </>
    )
  }
}
