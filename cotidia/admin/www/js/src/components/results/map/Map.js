import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

import { getMapIcon } from '../../../utils'

const { LatLngBounds } = window.google?.maps || {}

const getLatLngBounds = (items) => {
  const latLngBounds = new LatLngBounds()

  for (const { lat, lng } of items) {
    latLngBounds.extend({ lat, lng })
  }

  return latLngBounds
}

class Map extends Component {
  static propTypes = {
    defaultCoords: PropTypes.arrayOf(PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })),
    markerConfig: PropTypes.shape({
      labelField: PropTypes.string.isRequired,
      backgroundField: PropTypes.string.isRequired,
      foregroundField: PropTypes.string.isRequired,
    }).isRequired,
    onMarkerClick: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })).isRequired,
  }

  static defaultProps = {
    defaultCoords: [],
  }

  componentDidUpdate (prevProps) {
    if (prevProps.results !== this.props.results) {
      this.fitMap()
    }
  }

  mapRef = null

  storeMapRef = (ref) => {
    this.mapRef = ref

    this.fitMap()
  }

  fitMap = () => {
    if (this.mapRef) {
      let bounds

      if (this.props.results.length) {
        bounds = [ ...this.props.results ]
      } else {
        bounds = [ ...this.props.defaultCoords ]
      }

      if (bounds) {
        if (bounds.length === 1) {
          // If there's only one result, add two fake points NE and SW of that point that are each 1
          // degree away in lat and lng, meaning that the zoom doesn't get too close. Not ideal but
          // we can't specify a maximum zoom wirthout limiting the user-controlled zoom as well.
          bounds.push({
            lat: bounds[0].lat + 1,
            lng: bounds[0].lng + 1,
          })
          bounds.push({
            lat: bounds[0].lat - 1,
            lng: bounds[0].lng - 1,
          })
        }

        this.mapRef.fitBounds(getLatLngBounds(bounds), 20)
      }
    }
  }

  render () {
    const {
      markerConfig: {
        labelField,
        backgroundField,
        foregroundField,
      },
      onMarkerClick,
      results,
    } = this.props

    return (
      <GoogleMap
        defaultCenter={{ lat: 52, lng: 0 }}
        defaultZoom={9}
        ref={this.storeMapRef}
      >
        {results && results.map((item) => (
          <Marker
            icon={getMapIcon(item[labelField], item[backgroundField], item[foregroundField])}
            key={item.uuid}
            title={item[labelField]}
            position={{ lat: item.lat, lng: item.lng }}
            onClick={() => onMarkerClick(item)}
          />
        ))}
      </GoogleMap>
    )
  }
}

const WrappedResultsMap = withGoogleMap(Map)

export default function ResultsMap ({ ...props }) {
  return (
    <WrappedResultsMap
      {...props}
      containerElement={<div style={{ display: 'contents' }} />}
      mapElement={<div style={{ height: '100%' }} />}
    />
  )
}
