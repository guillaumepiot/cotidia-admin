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
      // otherButtons: <button className='btn btn--delete' type='button'>Reset columns</button>,
      form: true,
    },
  })
}

function * performSearch () {
  yield put({ type: types.SEARCH_START })

  const data = yield select((state) => state.search)

  const queryString = {}

  for (const [key, value] of Object.entries(data.filters)) {
    // If the value is an object, trest it specially.
    if ((Object(value) === value) && (! Array.isArray(value))) {
      let val = ''

      if (value.hasOwnProperty('min') && ! value.hasOwnProperty('max')) {
        val = `${value.min}:`
      } else if (value.hasOwnProperty('min') && value.hasOwnProperty('max')) {
        val = `${value.min}:${value.max}`
      } else if (! value.hasOwnProperty('min') && value.hasOwnProperty('max')) {
        val = `:${value.max}`
      }

      queryString[key] = val
    } else {
      // Anything else (primitives and arrays) can go in raw and be handled by generateURL.
      queryString[key] = value
    }
  }

  if (data.orderColumn) {
    queryString._order = `${data.orderAscending ? '' : '-'}${data.orderColumn}`
  }

  if (data.searchTerm) {
    queryString._q = data.searchTerm
  }

  let url = generateURL(data.endpoint, { '?': queryString })

  try {
    const { ok, data: result } = yield call(fetchAuthenticated, 'GET', url)

    if (ok) {
      yield put({
        type: types.STORE_RESULTS,
        payload: result,
      })
    }
  } finally {
    yield put({ type: types.SEARCH_END })
  }
}

function * getResultsPage ({ payload: { page } }) {
  yield put({ type: types.SEARCH_START })

  const pagination = yield select((state) => state.search.pagination)

  const url = page === 'next' ? pagination.next : pagination.previous

  try {
    const { ok, data: result } = yield call(fetchAuthenticated, 'GET', url)

    if (ok) {
      yield put({
        type: types.STORE_RESULTS,
        payload: result,
      })
    }
  } finally {
    yield put({ type: types.SEARCH_END })
  }
}

function * saveColumnConfig () {
  const state = yield select((state) => state.search)

  localStorage.setItem(state.endpoint, JSON.stringify({
    visibleColumns: state.visibleColumns,
  }))
}

function * removeSavedColumnConfig () {
  const state = yield select((state) => state.search)

  localStorage.setItem(state.endpoint, JSON.stringify({}))
}

function * performBatchAction ({ payload: { action } }) {
  const { search: { batchActions, selected } } = yield select()

  const batchAction = batchActions.find((batchAction) => batchAction.action === action)

  if (batchAction && selected.length) {
    try {
      const { ok, data, responseText } = yield call(
        fetchAuthenticated,
        'POST',
        batchAction.endpoint,
        { uuids: selected }
      )

      if (ok) {
        batchAction.onSuccess && batchAction.onSuccess(data)
        yield put({ type: types.PERFORM_SEARCH })
      } else {
        batchAction.onError && batchAction.onError(data || responseText)
      }
    } catch (e) {
      batchAction.onError && batchAction.onError(e)
    } finally {
      batchAction.onComplete && batchAction.onComplete()
    }
  }
}

function * handleSearchDashboardMessage ({ payload: { message } }) {
  const { search: { endpoint } } = yield select()

  if (message.endpoint === endpoint) {
    if (message.action === 'refresh') {
      yield put({ type: types.PERFORM_SEARCH })
    }
  }
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
  yield takeEvery(types.RESET_COLUMNS, removeSavedColumnConfig)

  yield takeEvery(types.GET_RESULTS_PAGE, getResultsPage)

  yield takeEvery(types.PERFORM_BATCH_ACTION, performBatchAction)

  yield takeEvery(types.HANDLE_SEARCH_DASHBOARD_MESSAGE, handleSearchDashboardMessage)
}
