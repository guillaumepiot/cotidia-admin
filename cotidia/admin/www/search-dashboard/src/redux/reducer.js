import { combineReducers } from 'redux'

import bootstrap from './modules/bootstrap'
import modal from './modules/modal'

export default combineReducers({
  bootstrap,
  modal,
})
