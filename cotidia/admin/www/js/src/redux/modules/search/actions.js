import * as types from './types'

export const loadStoredConfig = (config) => ({
  type: types.LOAD_STORED_CONFIG,
  payload: config,
})

export const setSearchTerm = (term) => ({
  type: types.SET_SEARCH_TERM,
  payload: { term },
})

export const switchMode = (mode) => ({
  type: types.SWITCH_MODE,
  payload: { mode },
})

export const configureFilter = (filter) => ({
  type: types.CONFIGURE_FILTER,
  payload: { filter },
})

export const clearFilter = (filter) => ({
  type: types.CLEAR_FILTER,
  payload: { filter },
})

export const clearFilters = () => ({
  type: types.CLEAR_FILTERS,
})

export const setOrderColumn = (column) => ({
  type: types.SET_ORDER_COLUMN,
  payload: { column },
})

export const toggleOrderDirection = () => ({
  type: types.TOGGLE_ORDER_DIRECTION,
})

export const manageColumns = () => ({
  type: types.MANAGE_COLUMNS,
})

export const toggleColumn = (column) => ({
  type: types.TOGGLE_COLUMN,
  payload: { column },
})

export const resetColumns = () => ({
  type: types.RESET_COLUMNS,
})

export const setFilterValue = (filter, value) => ({
  type: types.SET_FILTER_VALUE,
  payload: { filter, value },
})

export const refreshCurrentPage = () => ({
  type: types.GET_RESULTS_PAGE,
  payload: { page: null },
})

export const gotoPage = (page) => ({
  type: types.GET_RESULTS_PAGE,
  payload: { page },
})
export const setPerPage = (perPage) => ({
  type: types.SET_PER_PAGE,
  payload: { perPage },
})

export const toggleResultSelected = (item) => ({
  type: types.TOGGLE_RESULT_SELECTED,
  payload: { item },
})

export const toggleSelectAllResults = () => ({
  type: types.TOGGLE_SELECT_ALL_RESULTS,
})

export const performSearch = () => ({ type: types.PERFORM_SEARCH })

export const performBatchAction = (action) => ({
  type: types.PERFORM_BATCH_ACTION,
  payload: { action },
})

export const performGlobalAction = (action) => ({
  type: types.PERFORM_GLOBAL_ACTION,
  payload: { action },
})

export const handleDynamicListMessage = (message) => ({
  type: types.HANDLE_DYNAMIC_LIST_MESSAGE,
  payload: { message },
})

export const editField = (item, column, value) => ({
  type: types.EDIT_FIELD,
  payload: { item, column, value },
})

export const toggleSidebar = () => ({ type: types.TOGGLE_SIDEBAR })
export const showSidebar = (show) => ({ type: types.SHOW_SIDEBAR, payload: { show } })

export const moveColumn = (from, to) => ({
  type: types.MOVE_COLUMN,
  payload: { from, to },
})
