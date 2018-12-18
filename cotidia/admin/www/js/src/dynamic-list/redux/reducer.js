import { combineReducers } from 'redux'

import bootstrap from './modules/bootstrap'
import config from './modules/config'
import modal from './modules/modal'
import search from './modules/search'

export default combineReducers({
  bootstrap,
  config,
  modal,
  search,
})
