import * as types from './types'

const initialState = {
  endpoint: null,
  detailURL: null,
  columns: {}, // Config for all columns
  batchActions: [], // Config for all batch acitons

  defaultColumns: [], // Actual default columns as specifed by config
  visibleColumns: [], // Current visible columns

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

  selected: [],
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

    case types.SET_BATCH_ACTIONS:
      return {
        ...state,
        batchActions: payload,
      }

    case types.SET_COLUMN_CONFIG:
      return {
        ...state,
        columns: payload.columns,
        defaultColumns: payload.defaultColumns,
        visibleColumns: payload.defaultColumns,
        orderColumn: payload.defaultOrderColumn,
        orderAscending: payload.defaultOrderAscending,
        filters: payload.defaultFilters,
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
        // Normally this would be `results: payload.results`, but we need to filter out duplicates
        // that Django may be senidng us because it's not working correctly. So that's what this
        // reduce does here - it's building up a new result set by going through each element of the
        // payload's, and ignoring duplicate UUIDs.
        results: payload.results.reduce((agg, item) => {
          if (! agg.find((innerItem) => item.uuid === innerItem.uuid)) {
            agg.push(item)
          }

          return agg
        }, []),
        selected: [],
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

    case types.RESET_COLUMNS: {
      return {
        ...state,
        visibleColumns: state.defaultColumns,
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
      }

    case types.TOGGLE_RESULT_SELECTED:
      return {
        ...state,
        selected: state.selected.includes(payload.item)
          ? state.selected.filter((selectedItem) => selectedItem !== payload.item)
          : [ ...state.selected, payload.item ],
      }

    case types.TOGGLE_SELECT_ALL_RESULTS:
      return {
        ...state,
        selected: state.selected.length === state.results.length
          ? []
          : state.results.map((item) => item.uuid),
      }

    default:
      return state
  }
}
