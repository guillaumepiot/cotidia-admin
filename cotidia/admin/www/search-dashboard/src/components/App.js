import React from 'react'
import PropTypes from 'prop-types'

import { Route, Switch } from 'react-router-dom'

import { FullScreen } from './elements/global'
import Modal from '../containers/Modal'

import NotFound from './NotFound'

import SearchDashboard from '../containers/SearchDashboard'

export default function App ({ networkError, bootstrapped }) {
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
    <div>
      <Switch>
        <Route exact strict path='/' component={SearchDashboard} />
        <Route component={NotFound} />
      </Switch>

      <Modal />
    </div>
  )
}

App.propTypes = {
  bootstrapped: PropTypes.bool.isRequired,
  networkError: PropTypes.bool.isRequired,
}
