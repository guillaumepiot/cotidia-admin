import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Provider } from 'react-redux'
import configureStore from './redux/create'
import { bootstrap } from './redux/modules/bootstrap/actions'

import { messageHandlerFactory } from './utils'
import { appPropTypes } from './utils/propTypes'

import SearchDashboard from './containers/SearchDashboard'

import { FullScreen } from './components/elements/global'

import TypeaheadSwitcher from './typeahead-switcher'

export default function App (props) {
  const { authToken, ...config } = props

  if (! authToken) {
    return (
      <FullScreen>
        Dashboard configuration not provided.
      </FullScreen>
    )
  }

  sessionStorage.setItem('authToken', authToken)

  const { store } = configureStore()

  store.dispatch(bootstrap(config))

  window.addEventListener('message', messageHandlerFactory(store))

  return (
    <Provider store={store}>
      <SearchDashboard />
    </Provider>
  )
}

App.propTypes = appPropTypes

App.defaultProps = {
  batchActions: [],
  defaultColumns: [],
  defaultFilters: {},
  defaultOrderBy: null,
  detailURL: null,
  overrideStoredConfig: false,
}

window.React = React
window.ReactDOM = ReactDOM
window.SearchDashboard = App

window.TypeaheadSwitcher = TypeaheadSwitcher
