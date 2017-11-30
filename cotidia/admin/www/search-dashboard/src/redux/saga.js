import { all } from 'redux-saga/effects'

import bootstrap from './modules/bootstrap/sagas'
import search from './modules/search/sagas'

export default function * () {
  yield all([
    bootstrap(),
    search(),
  ])
}
