import { put, takeEvery } from 'redux-saga/effects'

import * as types from './types'
import * as searchActions from '../search/actions'
import * as searchTypes from '../search/types'

export function * bootstrap ({ payload: config }) {
  yield put({ type: searchTypes.SET_ENDPOINT, payload: config.endpoint })
  yield put({ type: searchTypes.SET_DETAIL_URL, payload: config.detailURL })

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
    type: searchTypes.SET_COLUMN_CONFIG,
    payload: {
      columns: config.columns,
      defaultColumns: config.defaultColumns,
      defaultFilters: config.defaultFilters,
      defaultOrderColumn,
      defaultOrderAscending,
    },
  })

  // If the config doesn't say to override any stored config, retrieve it from localStorage and
  // apply it on top of the setup we just did.
  if (config.overrideStoredConfig !== true) {
    try {
      const storedConfig = JSON.parse(localStorage.getItem(config.endpoint))

      if (storedConfig) {
        if (Array.isArray(storedConfig.visibleColumns)) {
          yield put(searchActions.setColumns(storedConfig.visibleColumns))
        }
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
