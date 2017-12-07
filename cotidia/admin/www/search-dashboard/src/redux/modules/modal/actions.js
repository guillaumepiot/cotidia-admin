import * as types from './types'

export const showModal = (component, componentProps) => ({
  type: types.SHOW_MODAL,
  payload: { component, componentProps },
})

export const closeModal = () => ({ type: types.CLOSE_MODAL })
export const submitModal = (data) => ({ type: types.SUBMIT_MODAL, payload: data })
