import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { generateURL } from '../../../utils/api'

import Map from './Map'

export default class SearchResultsMap extends Component {
  static propTypes = {
    defaultCoords: PropTypes.array.isRequired,
    detailURL: PropTypes.string,
    // loading: PropTypes.bool,
    marker: PropTypes.object.isRequired,
    results: PropTypes.arrayOf(PropTypes.object),
  }

  viewItem = (item) => {
    if (this.props.detailURL) {
      const url = generateURL(this.props.detailURL, item)

      window.open(url)
    }
  }

  render () {
    const {
      defaultCoords,
      marker,
      results,
    } = this.props

    return (
      <>
        <div style={{ display: 'contents' }}>
          <Map
            defaultCoords={defaultCoords}
            markerConfig={marker}
            onMarkerClick={this.viewItem}
            results={results}
          />
        </div>
      </>
    )
  }
}
