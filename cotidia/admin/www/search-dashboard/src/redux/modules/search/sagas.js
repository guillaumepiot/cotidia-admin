import { call, takeEvery } from 'redux-saga/effects'

import { showModal } from '../modal/sagas'

import * as types from './types'

export function * filterColumn ({ payload: { column } }) {
  yield call(showModal, {
    component: 'Filter',
    componentProps: { column },
  })
}

export default function * watcher () {
  yield takeEvery(types.FILTER_COLUMN, filterColumn)
}
