import { call, put, select, take, takeEvery } from 'redux-saga/effects'

import { generateURL, fetchAuthenticated } from '../../../utils/api'

import { showModal } from '../modal/sagas'

import * as types from './types'
import * as modalTypes from '../modal/types'

export function * filterColumn ({ payload: { column } }) {
  const { columns, filters } = yield select((state) => state.search)

  const { submittedData } = yield call(showModal, {
    component: 'Filter',
    componentProps: { filter: column },
    modalProps: {
      title: columns[column].label,
      form: true,
      submitButton: 'Update filter',
    },
    data: {
      value: filters[column],
    },
    modalActions: {
      submittedData: take(modalTypes.SUBMIT_MODAL),
    },
  })

  if (submittedData) {
    yield put({
      type: types.SET_FILTER_VALUE,
      payload: {
        filter: column,
        value: submittedData.payload.value,
      },
    })
  }
}

export function * manageColumns () {
  yield call(showModal, {
    component: 'ManageColumns',
    modalProps: {
      title: 'Configure columns',
      cancelButton: 'Close',
      form: true,
    },
  })
}

function * performSearch () {
  const data = yield select((state) => state.search)

  const queryString = { ...data.filters }

  if (data.orderColumn) {
    queryString._order = `${data.orderAscending ? '' : '-'}${data.orderColumn}`
  } else {
    if (data.visibleColumns.length) {
      queryString._order = data.visibleColumns[0]
    }
  }

  if (data.searchTerm) {
    queryString._q = data.searchTerm
  }

  let url = generateURL(data.endpoint, { '?': queryString })

  const { ok, data: result } = yield call(fetchAuthenticated, 'GET', url)

  if (ok) {
    yield put({
      type: types.STORE_RESULTS,
      payload: result,
    })
  }
}

function * getResultsPage ({ payload: { page } }) {
  const pagination = yield select((state) => state.search.pagination)

  const url = page === 'next' ? pagination.next : pagination.previous

  const { ok, data: result } = yield call(fetchAuthenticated, 'GET', url)

  if (ok) {
    yield put({
      type: types.STORE_RESULTS,
      payload: result,
    })
  }
}

function * saveColumnConfig () {
  const state = yield select((state) => state.search)

  localStorage.setItem(state.endpoint, JSON.stringify(state.visibleColumns))
}

export default function * watcher () {
  yield takeEvery(types.FILTER_COLUMN, filterColumn)
  yield takeEvery(types.MANAGE_COLUMNS, manageColumns)

  yield takeEvery(types.PERFORM_SEARCH, performSearch)
  yield takeEvery(types.SET_SEARCH_TERM, performSearch)
  yield takeEvery(types.SET_ORDER_COLUMN, performSearch)
  yield takeEvery(types.TOGGLE_ORDER_DIRECTION, performSearch)
  yield takeEvery(types.SET_FILTER_VALUE, performSearch)
  yield takeEvery(types.CLEAR_FILTER, performSearch)
  yield takeEvery(types.CLEAR_FILTERS, performSearch)

  yield takeEvery(types.TOGGLE_COLUMN, saveColumnConfig)

  yield takeEvery(types.GET_RESULTS_PAGE, getResultsPage)
}
