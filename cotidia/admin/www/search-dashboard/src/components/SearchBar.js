import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class SearchBar extends Component {
  static propTypes = {
    clearFilters: PropTypes.func.isRequired,
    manageColumns: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func.isRequired,
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

  render () {
    return (
      <form className='head-bar head-bar--filter' onSubmit={this.setSearchTerm}>
        <div className='form__group'>
          <label className='form__label'>Search</label>
          <div className='form__control'>
            <TextInput
              name='searchTerm'
              type='text'
              updateValue={this.updateSearchTerm}
              updateValueOnBlur={false}
              value={this.state.searchTerm}
            />
          </div>
        </div>

        <button className='btn btn--primary btn--transparent' onClick={this.setSearchTerm} type='button'>Filter</button>

        <button className='btn btn--transparent' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
          <span className='fa fa-refresh' />
        </button>

        <button className='btn btn--transparent' onClick={this.manageColumns} title='Manage column' type='button'>
          <span className='fa fa-columns' />
        </button>
      </form>
    )
  }
}
