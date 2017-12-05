import { call, put, select, takeEvery } from 'redux-saga/effects'

import { generateURL, fetchAuthenticated } from '../../../utils/api'

import { showModal } from '../modal/sagas'

import * as types from './types'

export function * filterColumn ({ payload: { column } }) {
  const x = yield call(showModal, {
    component: 'Filter',
    componentProps: { column },
    // modalActions
  })

  console.log(x)
}

function * performSearch () {
  const data = yield select((state) => state.search)

  const queryString = { ...data.filters }

  if (data.orderColumn) {
    queryString._order = `${data.orderAscending ? '' : '-'}${data.orderColumn}`
  }

  if (data.searchTerm) {
    queryString._q = data.searchTerm
  }

  let url = generateURL(data.endpoint, { '?': queryString })

  console.log(url)

  const results = yield call(fetchAuthenticated, 'GET', url)

  console.log(results)

  yield put({
    types: types.STORE_RESULTS,
    payload: results,
  })
}

export default function * watcher () {
  yield takeEvery(types.FILTER_COLUMN, filterColumn)

  yield takeEvery(types.SET_SEARCH_TERM, performSearch)
  yield takeEvery(types.SET_ORDER_COLUMN, performSearch)
  yield takeEvery(types.TOGGLE_ORDER_DIRECTION, performSearch)
}
