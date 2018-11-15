import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Map from './Map'

export default class SearchResultsMap extends Component {
  static propTypes = {
    defaultCoords: PropTypes.array.isRequired,
    detailURLField: PropTypes.string,
    // loading: PropTypes.bool,
    marker: PropTypes.object.isRequired,
    results: PropTypes.arrayOf(PropTypes.object),
  }

  getItemURL (item) {
    if (this.props.detailURLField) {
      const url = item[this.props.detailURLField]

      if (typeof url === 'string' && url.length) {
        return url
      }
    }

    return null
  }

  viewItem = (item) => {
    const url = this.getItemURL(item)

    if (! url) {
      return
    }

    window.open(url)
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
