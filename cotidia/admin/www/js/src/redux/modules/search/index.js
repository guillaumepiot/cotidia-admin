import * as types from './types'

const initialState = {
  title: null,
  endpoint: null,
  detailURL: null,

  columnConfiguration: {}, // Config for all columns
  columns: [], // Available columns (as an array of labelled categories)
  batchActions: [], // Config for all batch actions
  globalActions: [], // Config for all global actions

  extraFilters: {},
  toolbarFilters: [],
  sidebarFilters: [],

  defaultColumns: [], // Actual default columns as specifed by config
  visibleColumns: [], // Current visible columns

  listFields: null,

  mode: 'table',

  orderColumn: null,
  orderAscending: true,

  categoriseBy: null,

  initialFilters: {},
  filters: {},

  searchTerm: null,

  results: [],
  loading: false,
  searchID: null,

  perPage: 50,

  pagination: {
    totalResultsCount: 0,
    pageResultCount: 0,
    pageCount: 0,
    page: null,
  },

  selected: [],

  showSidebar: true,
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: payload,
      }

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

    case types.SET_GLOBAL_ACTIONS:
      return {
        ...state,
        globalActions: payload,
      }

    case types.SET_EXTRA_FILTERS:
      return {
        ...state,
        extraFilters: payload,
      }

    case types.SET_TOOLBAR_FILTERS:
      return {
        ...state,
        toolbarFilters: payload,
      }

    case types.SET_SIDEBAR_FILTERS:
      return {
        ...state,
        sidebarFilters: payload,
      }

    case types.SET_COLUMN_CONFIG:
      return {
        ...state,
        columnConfiguration: payload.columnConfiguration,
        columns: payload.columns,
        defaultColumns: payload.defaultColumns,
        visibleColumns: payload.defaultColumns,
        orderColumn: payload.defaultOrderColumn,
        orderAscending: payload.defaultOrderAscending,
        initialFilters: payload.defaultFilters,
        filters: payload.defaultFilters,
        listFields: payload.listFields,
        mode: payload.mode,
        categoriseBy: payload.categoriseBy,
      }

    case types.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: payload.term,
      }

    case types.SWITCH_MODE:
      return {
        ...state,
        mode: payload.mode,
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

    case types.SET_PER_PAGE:
      return {
        ...state,
        perPage: payload.perPage,
      }

    case types.SEARCH_START:
      return {
        ...state,
        loading: true,
        searchID: payload.id,
      }

    case types.SEARCH_END:
      if (state.searchID === payload.id) {
        return {
          ...state,
          loading: false,
        }
      } else {
        return state
      }

    case types.STORE_RESULTS:
      if (state.searchID === payload.id) {
        return {
          ...state,
          // Normally this would be `results: payload.results`, but we need to filter out duplicates
          // that Django may be senidng us because it's not working correctly. So that's what this
          // reduce does here - it's building up a new result set by going through each element of the
          // payload's, and ignoring duplicate UUIDs.
          results: payload.result.results.reduce((agg, item) => {
            if (! agg.find((innerItem) => item.uuid === innerItem.uuid)) {
              agg.push(item)
            }

            return agg
          }, []),
          selected: [],
          pagination: {
            totalResultsCount: payload.result.total_result_count,
            pageResultCount: payload.result.page_result_count,
            pageCount: payload.result.page_count,
            page: payload.result.current_page,
          },
        }
      } else {
        return state
      }

    case types.UPDATE_SINGLE_RESULT:
      return {
        ...state,
        results: state.results.map((result) => (
          result.uuid === payload.uuid ? payload.data : result
        ))
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

    case types.LOAD_STORED_CONFIG: {
      const newState = {}

      if (payload.visibleColumns) {
        newState.visibleColumns = payload.visibleColumns

        if (! payload.orderColumn) {
          newState.orderColumn = payload.visibleColumns[0]
          newState.orderAscending = true
        }
      }

      if (payload.orderColumn) {
        newState.orderColumn = payload.orderColumn

        if (payload.hasOwnProperty('orderAscending')) {
          newState.orderAscending = payload.orderAscending
        }
      }

      if (payload.mode) {
        newState.mode = payload.mode
      }

      if (payload.perPage) {
        newState.perPage = payload.perPage
      }

      if (payload.filters) {
        newState.filters = payload.filters
      }

      return {
        ...state,
        ...newState,
      }
    }

    case types.RESET_COLUMNS:
      return {
        ...state,
        visibleColumns: state.defaultColumns,
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
        filters: state.initialFilters,
        orderColumn: null,
        orderAscending: true,
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

    case types.TOGGLE_SIDEBAR:
      return {
        ...state,
        showSidebar: ! state.showSidebar,
      }

    case types.SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: payload.show,
      }

    case types.MOVE_COLUMN: {
      const visibleColumns = [ ...state.visibleColumns ]

      // Swap the elements using splice magic.
      visibleColumns.splice(payload.to, 0, ...visibleColumns.splice(payload.from, 1))

      return {
        ...state,
        visibleColumns,
      }
    }

    default:
      return state
  }
}
