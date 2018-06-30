import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FullScreen, Icon } from './elements/global'
import Modal from '../containers/Modal'

import SearchFilterSidebar from '../containers/SearchFilterSidebar'
import SearchBar from '../containers/SearchBar'
import SearchResultsList from '../containers/SearchResultsList'
import SearchResultsTable from '../containers/SearchResultsTable'
import Pagination from '../containers/Pagination'

export default class DynamicList extends Component {
  static propTypes = {
    bootstrapped: PropTypes.bool.isRequired,
    networkError: PropTypes.bool.isRequired,
    searchMode: PropTypes.string.isRequired,
    hasListConfig: PropTypes.bool.isRequired,
    showSidebar: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  }

  toggleSidebar = () => this.props.toggleSidebar()

  render () {
    const {
      bootstrapped,
      networkError,
      searchMode,
      showSidebar,
      hasListConfig,
    } = this.props

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
      <>
        <div className={`content ${showSidebar && 'content--sidebar'}`}>
          <SearchBar />

          <div className='content__body'>
            <div className='content__list'>
              {hasListConfig && (searchMode === 'list') && (
                <SearchResultsList />
              )}

              {searchMode === 'table' && (
                <SearchResultsTable />
              )}
            </div>
          </div>

          <div className='content__foot'>
            <Pagination />

            <div className='content__actions'>
              Download as
              <button className='btn btn--outline btn--small btn--create'>
                <Icon icon='file-text-o' />
                CSV
              </button>
              <button className='btn btn--outline btn--small btn--create'>
                <Icon icon='file-pdf-o' />
                PDF
              </button>
            </div>
          </div>
        </div>

        <Modal />
      </>
    )
  }
}
