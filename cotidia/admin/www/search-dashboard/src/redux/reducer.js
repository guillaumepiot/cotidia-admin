import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import bootstrap from './modules/bootstrap'
import modal from './modules/modal'

export default combineReducers({
  router: routerReducer,
  bootstrap,
  modal,
})
