import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
    manageColumns: PropTypes.func.isRequired,
    performBatchAction: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchActions: [],
  }

  state = {
    action: '',
    searchTerm: null,
  }

  componentWillMount () {
    this.setState({ searchTerm: this.props.searchTerm })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.setState({ searchTerm: nextProps.searchTerm })
    }
  }

  updateSearchTerm = ({ searchTerm }) => this.setState({ searchTerm })

  setSearchTerm = (e) => {
    if (e) {
      e.preventDefault()
    }

    this.props.setSearchTerm(this.state.searchTerm)
  }

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
    if (this.props.batchActions.length === 1) {
      return this.props.batchActions.map((action) => (
        <button
          className='btn btn--transparent'
          key={action.action}
          onClick={this.performBatchActionFactory(action.action)}
          title={action.label}
          type='button'
        >
          {action.label}
        </button>
      ))
    } else {
      return (
        <div className='form__control'>
          <select className='form__select' onChange={this.selectBatchAction} value={this.state.action}>
            <option value=''>Choose an action</option>
            { this.props.batchActions.map((action) => (
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
      <form className='head-bar head-bar--filter' onSubmit={this.setSearchTerm}>
        <TextInput
          label='Search'
          name='searchTerm'
          type='text'
          updateValue={this.updateSearchTerm}
          updateValueOnBlur={false}
          value={this.state.searchTerm}
        />

        <button className='btn btn--primary btn--transparent' onClick={this.setSearchTerm} type='button'>Filter</button>

        <button className='btn btn--transparent' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
          <span className='fa fa-refresh' />
        </button>

        <button className='btn btn--transparent' onClick={this.manageColumns} title='Manage column' type='button'>
          <span className='fa fa-columns' />
        </button>

        {this.renderBatchActions()}
      </form>
    )
  }
}
