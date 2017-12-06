import * as types from './types'

const initialState = {
  endpoint: null,
  detailURL: null,
  columns: {},

  visibleColumns: [],

  orderColumn: null,
  orderAscending: true,

  filters: {},

  searchTerm: null,

  results: [
    {
      id: 6,
      uuid: 'f7a7881f-048b-46ef-8290-6153472f2e3a',
      name: 'Bob Grundy',
      email: 'bob@grundy.com',
      date: '2017-11-30T15:18:21',
      type: 'Meat eater',
      active: true,
    },
    {
      id: 19,
      uuid: 'd337a7a8-965b-4bc3-b1a6-8c2536ef26b0',
      name: 'Alice Wolf',
      email: 'alice@wolf.com',
      date: '2017-12-25T12:01:48',
      type: 'Vegan',
      active: false,
    },
  ],
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_ENDPOINT:
      return {
        ...state,
        endpoint: payload,
      }

    case types.SET_DETAIL_URL:
      return {
        ...state,
        detailURL: payload,
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
