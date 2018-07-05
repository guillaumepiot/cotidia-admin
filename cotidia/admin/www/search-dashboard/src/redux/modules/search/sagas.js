import { call, put, select, take, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import isEqual from 'lodash.isequal'

import { uuid4 } from '../../../utils'
import { generateURL, fetchAuthenticated } from '../../../utils/api'

import { showModal } from '../modal/sagas'

import { refreshCurrentPage } from './actions'
import * as types from './types'
import * as modalTypes from '../modal/types'

export function * configureFilter ({ payload: { filter } }) {
  const { columns, extraFilters, filters } = yield select((state) => state.search)

  let title = 'Filter'

  if (columns[filter]) {
    title = columns[filter].label
  } else {
    title = extraFilters[filter].label
  }

  const { submittedData } = yield call(showModal, {
    component: 'Filter',
    componentProps: { filter },
    modalProps: {
      title: title,
      form: true,
      submitButton: 'Update filter',
    },
    data: {
      value: filters[filter],
    },
    modalActions: {
      submittedData: take(modalTypes.SUBMIT_MODAL),
    },
  })

  if (submittedData) {
    yield put({
      type: types.SET_FILTER_VALUE,
      payload: {
        filter,
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

// Ensure value is an actual value, otherwise coerce to empty string. Here, we say that 0 is an
// actual value, but anything else falsy isn't.
function getValue (value) {
  if (value === 0) {
    return value
  }

  return value || ''
}

export function getFilterValue (value) {
  // If the value is an object, treat it specially.
  if ((Object(value) === value) && (! Array.isArray(value))) {
    let val = ''

    if (value.hasOwnProperty('min') && ! value.hasOwnProperty('max')) {
      val = `${getValue(value.min)}:`
    } else if (value.hasOwnProperty('min') && value.hasOwnProperty('max')) {
      val = `${getValue(value.min)}:${getValue(value.max)}`
    } else if (! value.hasOwnProperty('min') && value.hasOwnProperty('max')) {
      val = `:${getValue(value.max)}`
    }

    // If min and max both had no value, skip this filter.
    if (val !== ':') {
      return val
    }
  } else {
    // Anything else (primitives and arrays) can go in raw and be handled by generateURL.

    // Though if value is the empty string or null/undefined, skip this filter.
    if (value !== '' && value != null) {
      return value
    }
  }
}

function getSearchQueryString (data) {
  const queryString = {}

  for (const [key, value] of Object.entries(data.filters)) {
    const val = getFilterValue(value)

    if (val != null) {
      queryString[key] = val
    }
  }

  if (data.orderColumn) {
    queryString._order = `${data.orderAscending ? '' : '-'}${data.orderColumn}`
  }

  if (data.searchTerm) {
    queryString._q = data.searchTerm
  }

  return queryString
}

function * performSearch () {
  const searchID = uuid4()

  yield put({ type: types.SEARCH_START, payload: { id: searchID } })

  const { search: data } = yield select()

  const queryString = getSearchQueryString(data)

  let url = generateURL(data.endpoint, { '?': queryString })

  try {
    const { ok, data: result } = yield call(fetchAuthenticated, 'GET', url)

    if (ok) {
      yield put({
        type: types.STORE_RESULTS,
        payload: {
          id: searchID,
          url,
          result,
        },
      })
    }
  } finally {
    yield put({ type: types.SEARCH_END, payload: { id: searchID } })
  }
}

function * getResultsPage ({ payload: { page } }) {
  const pagination = yield select((state) => state.search.pagination)

  const url = pagination[page]

  if (! url) {
    return
  }

  const searchID = uuid4()

  yield put({ type: types.SEARCH_START, payload: { id: searchID } })

  try {
    const { ok, data: result } = yield call(fetchAuthenticated, 'GET', url)

    if (ok) {
      yield put({
        type: types.STORE_RESULTS,
        payload: {
          id: searchID,
          url,
          result,
        },
      })
    }
  } finally {
    yield put({ type: types.SEARCH_END, payload: { id: searchID } })
  }
}

function * saveColumnConfig () {
  const state = yield select((state) => state.search)

  const config = {
    mode: state.mode,
    orderColumn: state.orderColumn,
    orderAscending: state.orderAscending,
  }

  // Only set visibleColumns if state.visibleColumns differs from state.defaultColumns, just so we
  // don't end up saving stuff the user didn't directly set and is likely to change
  if (! isEqual(state.visibleColumns, state.defaultColumns)) {
    config.visibleColumns = state.visibleColumns
  }

  if (Object.keys(state.filters).length) {
    config.filters = state.filters
  }

  localStorage.setItem(state.endpoint, JSON.stringify(config))
}

function * removeSavedColumnConfig () {
  const state = yield select((state) => state.search)

  // Get existing config from localStorage, defaulting to empty object if not set
  let config = {}

  try {
    config = JSON.parse(localStorage.getItem(state.endpoint)) || {}
  } catch {
    // pass
  }

  // Delete the visible columns entry
  delete config.visibleColumns

  // Set the new object back
  localStorage.setItem(state.endpoint, JSON.stringify(config))
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

function * performGlobalAction ({ payload: { action } }) {
  const { search } = yield select()

  const queryStringData = getSearchQueryString(search)
  const queryString = generateURL('', { '?': queryStringData })

  action.func(queryStringData, queryString)
}

function * handleDynamicListMessage ({ payload: { message } }) {
  const { search: { endpoint } } = yield select()

  if (message.endpoint === endpoint) {
    if (message.action === 'refresh') {
      yield put({ type: types.PERFORM_SEARCH })
    }
  }
}

function * editField ({ payload: { item, column, value } }) {
  const columnConfig = yield select((state) => state.search.columns[column])

  // TODO: Get full item object and pass it in to generateURL so that we have richer formatting of the URL.
  let url = generateURL(columnConfig.editEndpoint, { uuid: item })

  try {
    const { ok } = yield call(
      fetchAuthenticated,
      'PATCH',
      url,
      { [column]: value }
    )

    if (true || ok) {
      yield put(refreshCurrentPage())
    }
  } catch {
    // pass
  }
}

export default function * watcher () {
  yield takeEvery(types.CONFIGURE_FILTER, configureFilter)
  yield takeEvery(types.MANAGE_COLUMNS, manageColumns)

  yield takeEvery(types.PERFORM_SEARCH, performSearch)
  yield takeEvery(types.SET_SEARCH_TERM, performSearch)
  yield takeEvery(types.SET_ORDER_COLUMN, performSearch)
  yield takeEvery(types.TOGGLE_ORDER_DIRECTION, performSearch)
  yield takeEvery(types.SET_FILTER_VALUE, performSearch)
  yield takeEvery(types.CLEAR_FILTER, performSearch)
  yield takeEvery(types.CLEAR_FILTERS, performSearch)

  yield takeEvery(types.RESET_COLUMNS, removeSavedColumnConfig)
  yield takeEvery(
    [
      types.SEARCH_START,
      types.TOGGLE_COLUMN,
      types.SWITCH_MODE,
      types.MOVE_COLUMN,
    ],
    saveColumnConfig
  )

  yield takeEvery(types.GET_RESULTS_PAGE, getResultsPage)

  yield takeEvery(types.PERFORM_BATCH_ACTION, performBatchAction)
  yield takeEvery(types.PERFORM_GLOBAL_ACTION, performGlobalAction)

  yield takeEvery(types.HANDLE_DYNAMIC_LIST_MESSAGE, handleDynamicListMessage)
  yield takeEvery(types.EDIT_FIELD, editField)
}
