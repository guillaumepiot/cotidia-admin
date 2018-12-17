import * as types from './types'

const initialState = {
  component: null,
  componentProps: {},
  modalProps: {},
  data: {},
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SHOW_MODAL:
      return {
        ...state,
        component: payload.component,
        componentProps: payload.componentProps,
        modalProps: payload.modalProps,
        data: payload.data,
      }

    case types.HIDE_MODAL:
      return initialState

    default:
      return state
  }
}
