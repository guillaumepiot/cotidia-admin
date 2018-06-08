import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Provider } from 'react-redux'
import configureStore from './redux/create'
import { bootstrap } from './redux/modules/bootstrap/actions'

import { messageHandlerFactory } from './utils'

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

App.propTypes = {
  authToken: PropTypes.string.isRequired,
  batchActions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onComplete: PropTypes.func,
  })),
  columns: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    filter: PropTypes.oneOf(['text', 'choice', 'boolean', 'number', 'date']),
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })),
  })).isRequired,
  defaultColumns: PropTypes.arrayOf(PropTypes.string),
  listFields: PropTypes.shape({
    left: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    right: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
  }),
  defaultFilters: PropTypes.object,
  defaultOrderBy: PropTypes.string,
  detailURL: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  overrideStoredConfig: PropTypes.bool,
}

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
