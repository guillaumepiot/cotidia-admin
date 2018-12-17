import * as types from './types'

const initialState = {
  endpoint: null,

  columnConfiguration: {}, // Config for all columns
  columns: [], // Available columns (as an array of labelled categories)
  batchActions: [], // Config for all batch actions
  globalActions: [], // Config for all global actions

  filterConfiguration: {},
  toolbarFilters: [],
  sidebarFilters: [],
  filterSuggestConfiguration: {},

  defaultColumns: [], // Actual default columns as specified by config
  visibleColumns: [], // Current visible columns

  listFields: null,
  mapConfiguration: {},

  allowedResultsModes: ['table'],
  resultsMode: 'table',

  orderColumn: null,
  orderAscending: true,

  categoriseBy: null,

  initialFilters: {},
  filters: {},

  searchTerm: null,

  results: [],
  resultsMeta: {},
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

  detailItemShowing: null,
}

const resolveResultsMode = (requestedMode, allowedModes) => {
  if (allowedModes.includes(requestedMode)) {
    return requestedMode
  }

  if (allowedModes.includes('table')) {
    return 'table'
  }

  if (allowedModes.length) {
    return allowedModes[0]
  }

  throw new Error('No usable results mode found to display reults. There is a configuration error.')
}

const tidyFilters = (filters, state) => {
  const newFilters = {}

  for (let [filter, value] of Object.entries(filters)) {
    // If the value is the equivalent of "unset", skip it.
    if (value == null) {
      continue
    }

    // If it's an empty array, skip it.
    if (Array.isArray(value) && value.length === 0) {
      continue
    }

    if (state.filterConfiguration) {
      // If the filter doesn't exist, skip it.
      if (! state.filterConfiguration.hasOwnProperty(filter)) {
        continue
      }

      // If it's a text filter, the empty string is equivalent to unset, so skip it.
      if (state.filterConfiguration[filter].filter === 'text' && value === '') {
        continue
      }

      // If it's a boolean filter, false is equivalent to unset, so skip it.
      if (state.filterConfiguration[filter].filter === 'boolean' && value !== true) {
        continue
      }

      // If it's an array of choice values, ensure they are distinct.
      if (state.filterConfiguration[filter].filter === 'choice' && Array.isArray(value)) {
        value = Array.from(new Set(value))
      }
    }

    // Otherwise, add it to the new object.
    newFilters[filter] = value
  }

  return newFilters
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_ENDPOINT:
      return {
        ...state,
        endpoint: payload,
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

    case types.SET_FILTER_CONFIGURATION:
      return {
        ...state,
        filterConfiguration: payload,
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

    case types.SET_FILTER_SUGGEST_CONFIGURATION:
      return {
        ...state,
        filterSuggestConfiguration: payload,
      }

    case types.SET_SEARCH_CONFIG:
      return {
        ...state,
        columnConfiguration: payload.columnConfiguration,
        columns: payload.columns,
        defaultColumns: payload.defaultColumns,
        visibleColumns: payload.defaultColumns,
        orderColumn: payload.defaultOrderColumn,
        orderAscending: payload.defaultOrderAscending,
        perPage: payload.defaultPerPage,
        initialFilters: tidyFilters(payload.defaultFilters, payload),
        filters: tidyFilters(payload.defaultFilters, payload),
        listFields: payload.listFields,
        allowedResultsModes: payload.allowedResultsModes,
        resultsMode: resolveResultsMode(payload.defaultResultsMode, payload.allowedResultsModes),
        categoriseBy: payload.categoriseBy,
        mapConfiguration: payload.mapConfiguration,
      }

    case types.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: payload.term,
      }

    case types.SWITCH_MODE:
      return {
        ...state,
        resultsMode: resolveResultsMode(payload.resultsMode, state.allowedResultsModes),
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
            } else {
              console.warn(`Duplicate UUID ${item.uuid} detected, result item ignored.`)
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
          resultsMeta: payload.result.meta || {},
        }
      } else {
        return state
      }

    case types.UPDATE_SINGLE_RESULT:
      return {
        ...state,
        results: state.results.map((result) => (
          result.uuid === payload.uuid ? payload.data : result
        )),
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

      if (payload.resultsMode) {
        newState.resultsMode = resolveResultsMode(payload.resultsMode, state.allowedResultsModes)
      }

      if (payload.perPage) {
        newState.perPage = payload.perPage
      }

      if (payload.filters) {
        newState.filters = tidyFilters(payload.filters, state)
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
        filters: tidyFilters({
          ...state.filters,
          [payload.filter]: payload.value,
        }, state),
      }

    case types.REMOVE_FILTER_VALUE: {
      let newFilterValue = null

      // If the value is an array, remove this item from it.
      if (Array.isArray(state.filters[payload.filter])) {
        newFilterValue = state.filters[payload.filter].filter(
          (value) => value !== payload.value
        )
      }

      // If the value wasn't an array, or was an array but woudl now have no items, null it out.
      return {
        ...state,
        filters: tidyFilters({
          ...state.filters,
          [payload.filter]: newFilterValue,
        }, state),
      }
    }

    case types.CLEAR_FILTER:
      return {
        ...state,
        filters: tidyFilters({
          ...state.filters,
          [payload.filter]: null,
        }, state),
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

    case types.SHOW_DETAIL_MODAL:
      return {
        ...state,
        detailItemShowing: state.results.findIndex((item) => item === payload.item),
      }

    default:
      return state
  }
}
