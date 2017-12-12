import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FullScreen } from './elements/global'
import Modal from '../containers/Modal'

import SearchBar from '../containers/SearchBar'
import SearchResults from '../containers/SearchResults'

export default class SearchDashboard extends Component {
  render () {
    const { bootstrapped, networkError } = this.props

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
        <SearchBar />
        <SearchResults />

        <Modal />
      </>
    )
  }
}

SearchDashboard.propTypes = {
  bootstrapped: PropTypes.bool.isRequired,
  networkError: PropTypes.bool.isRequired,
}
