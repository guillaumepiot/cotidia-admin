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
  endpoint: PropTypes.string.isRequired,
  detailURL: PropTypes.string,
  defaultColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  columns: PropTypes.objectOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    display: PropTypes.oneOf(['verbatim', 'date', 'datetime', 'boolean']),
    filter: PropTypes.oneOf(['text', 'choice', 'boolean', 'number', 'date']),
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })),
  })).isRequired,
}

App.defaultProps = {
  detailURL: null,
}

window.React = React
window.ReactDOM = ReactDOM
window.SearchDashboard = App
