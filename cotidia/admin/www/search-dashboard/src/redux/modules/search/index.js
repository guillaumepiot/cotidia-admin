import * as types from './types'

const initialState = {
  searchTerm: null,
  results: null,
  columns: [],
  orderColumn: null,
  orderAscending: true,
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: payload.term,
      }

    case types.SET_ORDER_COLUMN:
      return {
        ...state,
        orderColumn: payload.column,
        orderAscending: true,
      }

    case types.TOGGLE_ORDER_DIRECTION:
      return {
        ...state,
        orderAscending: ! state.orderAscending,
      }

    default:
      return state
  }
}
