import { call, put, select, take, takeEvery } from 'redux-saga/effects'
import isEqual from 'lodash.isequal'

import { uuid4 } from '../../../utils'
import { generateURL, fetchAuthenticated } from '../../../utils/api'

import { showModal } from '../modal/sagas'

import * as types from './types'
import * as modalTypes from '../modal/types'

export function * configureFilter ({ payload: { filter } }) {
  const { filterConfiguration, filters } = yield select((state) => state.search)

  let title = filterConfiguration[filter].label

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

function getSearchQueryString (data, page = null) {
  const queryString = {}

  for (const [key, value] of Object.entries(data.filters)) {
    if (data.filterConfiguration.hasOwnProperty(key)) {
      const queryParameter = data.filterConfiguration[key].queryParameter || key

      const val = getFilterValue(value)

      if (val != null) {
        queryString[queryParameter] = val
      }
    }
  }

  if (data.orderColumn) {
    queryString._order = `${data.orderAscending ? '' : '-'}${data.orderColumn}`
  }

  if (data.searchTerm) {
    queryString._q = data.searchTerm
  }

  if (page) {
    queryString._per_page = data.perPage
    queryString._page = page
  }

  return queryString
}

function * performSearch () {
  // Before we perform the actual search, quickly just fire off the filter change event.
  const { search: data } = yield select()

  const filterChangeEvent = new CustomEvent(
    'DynamicList:filterChange',
    { bubbles: true, detail: data.filters }
  )

  document.dispatchEvent(filterChangeEvent)

  // Now do the search - hardcode page to 1 to reset to first page.
  yield call(getSearchResultForPage, 1)
}

function * getSearchResultForPage (page = null) {
  const searchID = uuid4()

  const { search: data } = yield select()

  // If no page was sent in, default to the current page as a way to "refresh" the current page,
  // further defaulting to 1 if there's no current Page set.
  if (! page) {
    page = data.pagination.page || 1
  }

  const queryString = getSearchQueryString(data, page)

  const url = generateURL(data.endpoint, { '?': queryString })

  try {
    yield put({ type: types.SEARCH_START, payload: { id: searchID } })

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

function * refreshSingleResult ({ uuid }) {
  const { search: { endpoint } } = yield select()

  let url = generateURL(endpoint, { '?': { uuid } })

  const { ok, data } = yield call(fetchAuthenticated, 'GET', url)

  if (ok && data.results?.length) {
    yield put({
      type: types.UPDATE_SINGLE_RESULT,
      payload: {
        uuid,
        // There should only be one result, but it'll still be an array. Either
        // way, we only care about one result.
        data: data.results[0],
      },
    })
  }
}

function * getResultsPage ({ payload: { page } }) {
  yield call(getSearchResultForPage, page)
}

function * saveColumnConfig () {
  // If we're in storage override mode, don't save anything to storage.
  const ignoreStoredConfig = yield select((state) => state.config.ignoreStoredConfig)

  if (ignoreStoredConfig === true) {
    return
  }

  const state = yield select((state) => state.search)

  const config = {
    mode: state.mode,
    orderColumn: state.orderColumn,
    orderAscending: state.orderAscending,
    perPage: state.perPage,
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
  // If we're in storage override mode, don't save anything to storage.
  const ignoreStoredConfig = yield select((state) => state.config.ignoreStoredConfig)

  if (ignoreStoredConfig === true) {
    return
  }

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

  // Don't pass a page into getSearchQueryString as we don't want the results to be paginated.
  const queryStringData = getSearchQueryString(search)
  const queryString = generateURL('', { '?': queryStringData })

  action.func(queryStringData, queryString)
}

function * handleDynamicListMessage ({ payload: { message } }) {
  const { search: { endpoint } } = yield select()

  if (message.endpoint === endpoint) {
    if (message.action === 'refresh') {
      // A `null` page will get the current page.
      yield put({ type: types.GET_RESULTS_PAGE, payload: { page: null } })
    } else if (message.action === 'refreshResult') {
      yield put({ type: types.REFRESH_SINGLE_RESULT, uuid: message.resultUUID })
    }
  }
}

function * editField ({ payload: { item, column, value } }) {
  const columnConfig = yield select((state) => state.search.columnConfiguration[column])

  // TODO: Get full item object and pass it in to generateURL so that we have richer formatting of the URL.
  let url = generateURL(columnConfig.editEndpoint, { uuid: item })

  try {
    const { ok, data } = yield call(
      fetchAuthenticated,
      'PATCH',
      url,
      { [column]: value }
    )

    if (ok) {
      if (data) {
        yield put({
          type: types.UPDATE_SINGLE_RESULT,
          payload: {
            uuid: item,
            data,
          },
        })
      }

      if (columnConfig.afterEdit) {
        columnConfig.afterEdit(value)
      }
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
  yield takeEvery(types.SET_PER_PAGE, performSearch)
  yield takeEvery(types.SET_FILTER_VALUE, performSearch)
  yield takeEvery(types.CLEAR_FILTER, performSearch)
  yield takeEvery(types.CLEAR_FILTERS, performSearch)

  yield takeEvery(types.REFRESH_SINGLE_RESULT, refreshSingleResult)

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
