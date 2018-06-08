import * as types from './types'

const initialState = {
  dateFormat: 'D MMM YYYY',
  datetimeFormat: 'D MMM YYYY @ HH:mm',
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_CONFIG:
      return {
        ...state,
        ...payload,
      }

    default:
      return state
  }
}
