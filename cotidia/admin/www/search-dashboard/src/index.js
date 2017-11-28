import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import configureStore from './redux/create'

import { ConnectedRouter as Router } from 'react-router-redux'
import App from './containers/App'

import { bootstrap } from './redux/modules/bootstrap/actions'

const { store, history } = configureStore()

store.dispatch(bootstrap())

const app = (
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
)
ReactDOM.render(app, document.getElementById('root'))
