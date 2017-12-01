import * as types from './types'

const initialState = {
  endpoint: null,
  columns: {},

  visibleColumns: [],

  orderColumn: null,
  orderAscending: true,

  filters: {},

  searchTerm: null,

  results: null,
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_ENDPOINT:
      return {
        ...state,
        endpoint: payload,
      }

    case types.SET_COLUMN_CONFIG:
      return {
        ...state,
        columns: payload.columns,
        visibleColumns: payload.defaultColumns,
      }

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

    case types.STORE_RESULTS:
      return {
        ...state,
        results: payload,
      }

    default:
      return state
  }
}
