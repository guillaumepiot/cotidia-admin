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

  results: [],
  loading: false,

  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
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
        orderColumn: payload.defaultColumns[0],
        orderAscending: true,
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

    case types.SEARCH_START:
      return {
        ...state,
        loading: true,
      }

    case types.SEARCH_END:
      return {
        ...state,
        loading: false,
      }

    case types.STORE_RESULTS:
      return {
        ...state,
        results: payload.results.reduce((agg, item) => {
          if (! agg.find((innerItem) => item.uuid === innerItem.uuid)) {
            agg.push(item)
          }

          return agg
        }, []),
        pagination: {
          count: payload.count,
          next: payload.next,
          previous: payload.previous,
        },
      }

    case types.TOGGLE_COLUMN: {
      const visibleColumns =
        state.visibleColumns.includes(payload.column)
          ? state.visibleColumns.filter((column) => column !== payload.column)
          : [ ...state.visibleColumns, payload.column ]

      // TODO: Should we reset order column and direction if we are hiding the current order column?
      // So far I have gone with not doing so, as it'll kick off a new search and therefore mess
      // with the displayed results.

      return {
        ...state,
        visibleColumns,
      }
    }

    case types.SET_COLUMNS: {
      return {
        ...state,
        visibleColumns: payload.columns,
        orderColumn: payload.columns[0],
        orderAscending: true,
      }
    }

    case types.SET_FILTER_VALUE:
      return {
        ...state,
        filters: {
          ...state.filters,
          [payload.filter]: payload.value,
        },
      }

    case types.CLEAR_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [payload.filter]: null,
        },
      }

    case types.CLEAR_FILTERS:
      return {
        ...state,
        searchTerm: null,
        filters: {},
        orderColumn: null,
        orderAscending: true,
      }

    default:
      return state
  }
}
