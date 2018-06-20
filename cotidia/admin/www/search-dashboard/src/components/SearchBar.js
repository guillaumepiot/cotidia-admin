import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { debounce } from '../utils'

import { TextInput } from '@cotidia/react-ui'

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
    hasListConfig: PropTypes.bool.isRequired,
    manageColumns: PropTypes.func.isRequired,
    mode: PropTypes.string,
    performBatchAction: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func.isRequired,
    switchMode: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchActions: [],
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
    return (
      <>
        {this.props.hasListConfig && (
          <div className='head-bar text-right'>
            <div style={{ flex: 1 }} />

            <button className={`btn ${this.props.mode === 'list' ? '' : 'btn--outline'}`} onClick={this.displayList}>
              <span className='fa fa-fw fa-list' />
            </button>
            <button className={`btn ${this.props.mode === 'table' ? '' : 'btn--outline'}`} onClick={this.displayTable}>
              <span className='fa fa-fw fa-table' />
            </button>
          </div>
        )}
        <div className='head-bar head-bar--filter'>
          <TextInput
            label='Search'
            name='searchTerm'
            prefix={<span className='fa fa-search' />}
            type='text'
            updateValue={this.updateSearchTerm}
            updateValueOnBlur={false}
            value={this.props.searchTerm}
          />

          <button className='btn btn--outline' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
            <span className='fa fa-fw fa-refresh' />
          </button>

          {this.props.columnsConfigurable && (
            <button className='btn btn--outline' onClick={this.manageColumns} title='Manage column' type='button'>
              <span className='fa fa-fw fa-columns' />
            </button>
          )}

          {this.renderBatchActions()}
        </div>
      </>
    )
  }
}
