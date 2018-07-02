import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FullScreen, Icon } from './elements/global'
import Modal from '../containers/Modal'

import Header from '../containers/Header'
import FilterSidebar from '../containers/FilterSidebar'
import ToolBar from '../containers/ToolBar'
import SearchResultsList from '../containers/SearchResultsList'
import SearchResultsTable from '../containers/SearchResultsTable'
import Pagination from '../containers/Pagination'
import GlobalActions from '../containers/GlobalActions'

export default class DynamicList extends Component {
  static propTypes = {
    bootstrapped: PropTypes.bool.isRequired,
    networkError: PropTypes.bool.isRequired,
    searchMode: PropTypes.string.isRequired,
    hasListConfig: PropTypes.bool.isRequired,
    showSidebar: PropTypes.bool.isRequired,
  }

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
          <Header />
          <ToolBar />

          <div className='content__body'>
            <div className='content__list'>
              {hasListConfig && (searchMode === 'list') && (
                <SearchResultsList />
              )}

              {searchMode === 'table' && (
                <SearchResultsTable />
              )}
            </div>

            <FilterSidebar />
          </div>

          <div className='content__foot'>
            <Pagination />
            <GlobalActions />
          </div>
        </div>

        <Modal />
      </>
    )
  }
}
