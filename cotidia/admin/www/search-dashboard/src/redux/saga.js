import { all } from 'redux-saga/effects'

import bootstrap from './modules/bootstrap/sagas'

export default function * () {
  yield all([
    bootstrap(),
  ])
}
