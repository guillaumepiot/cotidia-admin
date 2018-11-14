import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FullScreen } from './elements/global'
import Modal from '../containers/Modal'

import FilterSidebar from '../containers/FilterSidebar'
import ToolBar from '../containers/ToolBar'

import SearchResultsList from '../containers/results/list/SearchResultsList'
import SearchResultsMap from '../containers/results/map/SearchResultsMap'
import SearchResultsTable from '../containers/results/table/SearchResultsTable'

import Pagination from '../containers/Pagination'
import GlobalActions from '../containers/GlobalActions'

export default class DynamicList extends Component {
  static propTypes = {
    bootstrapped: PropTypes.bool.isRequired,
    networkError: PropTypes.bool.isRequired,
    hasSidebar: PropTypes.bool.isRequired,
    resultsMode: PropTypes.string.isRequired,
    showSidebar: PropTypes.bool.isRequired,
    title: PropTypes.string,
  }

  render () {
    const {
      bootstrapped,
      hasSidebar,
      networkError,
      resultsMode,
      showSidebar,
      title,
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
        {title && (
          <div className='content__head'>
            <div className='content__inner content-head'>
              <div className='content-head__title'>{title}</div>
            </div>
          </div>
        )}

        <ToolBar />

        <div className={`content__body ${(hasSidebar && showSidebar) ? 'content__body--sidebar' : ''}`}>
          <div className='content__inner'>
            <div className='content__list'>
              {resultsMode === 'list' && (
                <SearchResultsList />
              )}
              {resultsMode === 'table' && (
                <SearchResultsTable />
              )}
              {resultsMode === 'map' && (
                <SearchResultsMap />
              )}
            </div>
            <FilterSidebar />
          </div>
        </div>

        {resultsMode !== 'map' && (
          <div className='content__foot'>
            <div className='content__inner content-foot'>
              <Pagination />
              <GlobalActions />
            </div>
          </div>
        )}

        <Modal />
      </>
    )
  }
}
