import { createStore, applyMiddleware, compose } from 'redux'

import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

import createHistory from 'history/createBrowserHistory'

import rootReducer from './reducer'
import rootSaga from './saga'

export default () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const history = createHistory()

  const routerMiddleware = createRouterMiddleware(history)
  const sagaMiddleware = createSagaMiddleware()

  const middleware = composeEnhancers(applyMiddleware(routerMiddleware, sagaMiddleware))

  const store = createStore(rootReducer, middleware)

  sagaMiddleware.run(rootSaga)

  return { store, history }
}
