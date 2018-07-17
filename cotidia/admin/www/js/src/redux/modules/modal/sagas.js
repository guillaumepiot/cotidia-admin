import { put, race, take } from 'redux-saga/effects'

import * as types from './types'

export function * showModal ({
  component,
  componentProps = {},
  modalProps = {},
  data = {},
  modalActions = {},
}) {
  yield put({
    type: types.SHOW_MODAL,
    payload: { component, componentProps, modalProps, data },
  })

  let raceParams = {
    cancel: take(types.CLOSE_MODAL),
  }

  if (modalActions) {
    raceParams = {
      ...raceParams,
      ...modalActions,
    }
  }

  const raceResult = yield race(raceParams)

  yield put({ type: types.HIDE_MODAL })

  return raceResult
}
