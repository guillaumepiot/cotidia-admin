import { put, takeEvery } from 'redux-saga/effects'

import * as types from './types'
import * as configTypes from '../config/types'
import * as searchActions from '../search/actions'
import * as searchTypes from '../search/types'

export function * bootstrap ({ payload: config }) {
  yield put({ type: searchTypes.SET_TITLE, payload: config.title })
  yield put({ type: searchTypes.SET_ENDPOINT, payload: config.endpoint })
  yield put({ type: searchTypes.SET_DETAIL_URL, payload: config.detailURL })
  yield put({ type: searchTypes.SET_BATCH_ACTIONS, payload: config.batchActions || [] })
  yield put({ type: searchTypes.SET_GLOBAL_ACTIONS, payload: config.globalActions || [] })
  yield put({ type: searchTypes.SET_FILTER_CONFIGURATION, payload: config.filterConfiguration || {} })
  yield put({ type: searchTypes.SET_TOOLBAR_FILTERS, payload: config.toolbarFilters || [] })
  yield put({ type: searchTypes.SET_SIDEBAR_FILTERS, payload: config.sidebarFilters || [] })
  yield put({ type: searchTypes.SET_FILTER_SUGGEST_CONFIGURATION, payload: config.filterSuggestConfiguration })

  const { sidebarStartsShown = false, ...configRest } = config.config

  yield put({ type: searchTypes.SHOW_SIDEBAR, payload: { show: sidebarStartsShown } })
  yield put({
    type: configTypes.SET_CONFIG,
    payload: {
      ...configRest,
      ignoreStoredConfig: config.ignoreStoredConfig || false,
    },
  })

  let defaultOrderColumn = config.defaultColumns[0]
  let defaultOrderAscending = true

  if (config.defaultOrderBy) {
    if (config.defaultOrderBy[0] === '-') {
      defaultOrderAscending = false
      defaultOrderColumn = config.defaultOrderBy.slice(1)
    } else {
      defaultOrderColumn = config.defaultOrderBy
    }
  }

  yield put({
    type: searchTypes.SET_SEARCH_CONFIG,
    payload: {
      columnConfiguration: config.columnConfiguration,
      columns: config.columns,
      defaultColumns: config.defaultColumns,
      defaultFilters: config.defaultFilters,
      defaultPerPage: config.defaultPerPage || 50,
      listFields: config.listFields,
      defaultOrderColumn,
      defaultOrderAscending,
      allowedResultsModes: config.allowedResultsModes || ['table'],
      defaultResultsMode: config.defaultResultsMode || 'table',
      categoriseBy: config.categoriseBy || null,
    },
  })

  // If the config doesn't say to override any stored config, retrieve it from localStorage and
  // apply it on top of the setup we just did.
  if (config.ignoreStoredConfig !== true) {
    try {
      const storedConfig = JSON.parse(localStorage.getItem(config.endpoint))

      if (storedConfig) {
        yield put(searchActions.loadStoredConfig(storedConfig))
      }
    } catch {
      // pass
    }
  }

  yield put({ type: searchTypes.PERFORM_SEARCH })
  yield put({ type: types.BOOTSTRAPPED })
}

export default function * watcher () {
  yield takeEvery(types.BOOTSTRAP, bootstrap)
}
