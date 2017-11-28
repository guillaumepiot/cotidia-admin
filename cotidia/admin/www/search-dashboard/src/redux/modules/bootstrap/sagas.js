import { put, takeEvery } from 'redux-saga/effects'

import * as types from './types'

export function * bootstrap (action) {
  yield put({ type: types.BOOTSTRAPPED })
}

export default function * watcher () {
  yield takeEvery(types.BOOTSTRAP, bootstrap)
}
