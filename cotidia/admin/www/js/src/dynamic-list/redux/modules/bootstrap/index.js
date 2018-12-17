import * as types from './types'

const initialState = {
  networkError: false,
  bootstrapped: false,
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.NETWORK_ERROR:
      return {
        ...state,
        networkError: true,
      }

    case types.BOOTSTRAPPED:
      return {
        ...state,
        bootstrapped: true,
      }

    default:
      return state
  }
}
