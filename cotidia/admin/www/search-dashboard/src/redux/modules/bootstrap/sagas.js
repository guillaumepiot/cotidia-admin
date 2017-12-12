import { put, takeEvery } from 'redux-saga/effects'

import * as types from './types'
import * as searchTypes from '../search/types'

export function * bootstrap ({ payload: config }) {
  yield put({ type: searchTypes.SET_ENDPOINT, payload: config.endpoint })
  yield put({ type: searchTypes.SET_DETAIL_URL, payload: config.detailURL })
  yield put({
    type: searchTypes.SET_COLUMN_CONFIG,
    payload: {
      columns: config.columns,
      defaultColumns: config.defaultColumns,
    },
  })

  yield put({ type: searchTypes.PERFORM_SEARCH })
  yield put({ type: types.BOOTSTRAPPED })
}

export default function * watcher () {
  yield takeEvery(types.BOOTSTRAP, bootstrap)
}
