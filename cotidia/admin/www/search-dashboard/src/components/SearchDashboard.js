import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FullScreen } from './elements/global'
import Modal from '../containers/Modal'

import SearchBar from '../containers/SearchBar'
import SearchResultsList from '../containers/SearchResultsList'
import SearchResultsTable from '../containers/SearchResultsTable'

export default class SearchDashboard extends Component {
  static propTypes = {
    bootstrapped: PropTypes.bool.isRequired,
    networkError: PropTypes.bool.isRequired,
    searchMode: PropTypes.string.isRequired,
    hasListConfig: PropTypes.bool.isRequired,
  }

  render () {
    const { bootstrapped, networkError, searchMode, hasListConfig } = this.props

    if (networkError) {
      return (
        <FullScreen>
          <p>Sorry there has been an issue contacting the API. Please refresh your browser and try again.</p>
        </FullScreen>
      )
    }

    if (! bootstrapped) {
      return (
        <FullScreen>
          <p>Please wait, loading...</p>
        </FullScreen>
      )
    }

    return (
      <div className='content__list'>
        <SearchBar />

        {hasListConfig && (searchMode === 'list') && (
          <SearchResultsList />
        )}

        {searchMode === 'table' && (
          <SearchResultsTable />
        )}

        <Modal />
      </div>
    )
  }
}
