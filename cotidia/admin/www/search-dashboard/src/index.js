import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Provider } from 'react-redux'
import configureStore from './redux/create'
import { bootstrap } from './redux/modules/bootstrap/actions'

import SearchDashboard from './containers/SearchDashboard'

import { FullScreen } from './components/elements/global'

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

  return (
    <Provider store={store}>
      <SearchDashboard />
    </Provider>
  )
}

App.propTypes = {
  authToken: PropTypes.string.isRequired,
  columns: PropTypes.objectOf(PropTypes.shape({
    display: PropTypes.oneOf(['verbatim', 'date', 'datetime', 'boolean']),
    filter: PropTypes.oneOf(['text', 'choice', 'boolean', 'number', 'date']),
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })),
  })).isRequired,
  defaultColumns: PropTypes.arrayOf(PropTypes.string),
  defaultFilters: PropTypes.object,
  defaultOrderBy: PropTypes.string,
  detailURL: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  overrideStoredConfig: PropTypes.bool,
}

App.defaultProps = {
  defaultColumns: [],
  defaultFilters: {},
  defaultOrderBy: null,
  detailURL: null,
  overrideStoredConfig: false,
}

window.React = React
window.ReactDOM = ReactDOM
window.SearchDashboard = App
