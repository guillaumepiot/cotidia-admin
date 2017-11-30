import { combineReducers } from 'redux'

import bootstrap from './modules/bootstrap'
import modal from './modules/modal'
import search from './modules/search'

export default combineReducers({
  bootstrap,
  modal,
  search,
})
