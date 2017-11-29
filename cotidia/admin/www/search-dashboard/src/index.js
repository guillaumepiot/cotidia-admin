import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import configureStore from './redux/create'

import SearchDashboard from './containers/SearchDashboard'

import { bootstrap } from './redux/modules/bootstrap/actions'

const { store } = configureStore()

store.dispatch(bootstrap())

const app = (
  <Provider store={store}>
    <SearchDashboard />
  </Provider>
)
ReactDOM.render(app, document.getElementById('root'))
