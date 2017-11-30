import { call, put, race, take } from 'redux-saga/effects'

// import * as api from '../../../utils/api'

// import { NETWORK_ERROR } from '../bootstrap/types'
import * as types from './types'

// import allTypes from '../../types'

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

// export function * showModalForm ({
//   component,
//   componentProps,
//   modalProps = {},
//   entity,
//   identifier = null,
//   data,
//   handleSubmit = performModalFormSubmit,
// }) {
//   // Start the "show modal" saga, passing in our own action logic.
//   const { action, cancel } = yield call(showModal, {
//     component,
//     componentProps,
//     modalProps: {
//       errorKey: identifier || entity,
//       ...modalProps,
//       form: true,
//     },
//     data,
//     modalActions: {
//       action: call(handleModalFormData, { entity, identifier, handleSubmit }),
//     },
//   })
//
//   // If the modal was cancelled, return false.
//   if (cancel) {
//     return false
//   }
//
//   // Otherwise return whatever the action resolved to.
//   return action
// }
//
// export function * handleModalFormData ({ entity, identifier, handleSubmit }) {
//   while (true) {
//     const formData = yield take(types.SUBMIT_MODAL)
//
//
//     // Now perform the "submit" action and gte its response.
//     const actionFinished = yield call(handleSubmit, entity, identifier, formData.payload)
//
//     // If the action returns true, it means that submission succeeded, so complete this sub-saga so
//     // that the parent saga continues and closes the modal. Otherwise, we take another lap around
//     // the neverending loop, thus keeping the modal open and listening, yet again, for SUBMIT_MODAL.
//
//     if (actionFinished) {
//       return true
//     }
//   }
// }
//
// export function * performModalFormSubmit (entity, identifier, formData) {
//   const entityAction = `${identifier ? 'EDIT' : 'ADD'}_${entity.toUpperCase()}`
//
//   let url = api[`${entityAction}_URL`]
//   let method = 'POST'
//
//   if (identifier) {
//     url = api.generateURL(url, { uuid: identifier })
//     method = 'PUT'
//   }
//
//   const successAction = allTypes[`${entityAction}_SUCCESS`]
//   const errorAction = allTypes[`${entityAction}_ERROR`]
//
//   try {
//     const { ok, data, status } = yield call(api.fetchAuthenticated, method, url, formData)
//
//     if (ok) {
//       yield put({ type: successAction, payload: { data } })
//     } else {
//       // 400 ("Bad request") will be a validation error, so handle it as such.
//       if (status === 400) {
//         // Return `false` to say that the action is not finished and can keep looping.
//         return false
//       } else {
//         yield put({ type: errorAction, payload: data })
//       }
//     }
//   } catch (e) {
//     yield put({ type: errorAction, payload: { message: 'Network/API error.' } })
//     yield put({ type: NETWORK_ERROR })
//   }
//
//   // Anything other than a validaiton error can be classed as a completed action, however badly.
//   return true
// }
