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

  performBatchActionFactory = (action) => () => {
    this.props.performBatchAction(action)
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

        {this.props.batchActions.map((action) => (
          <button
            className='btn btn--transparent'
            key={action.action}
            onClick={this.performBatchActionFactory(action.action)}
            title={action.label}
            type='button'
          >
            {action.label}
          </button>
        ))}
      </form>
    )
  }
}
