import * as types from './types'

export const setSearchTerm = (term) => ({
  type: types.SET_SEARCH_TERM,
  payload: { term },
})

export const filterColumn = (column) => ({
  type: types.FILTER_COLUMN,
  payload: { column },
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

export const setColumns = (columns) => ({
  type: types.SET_COLUMNS,
  payload: { columns },
})

export const setFilterValue = (filter, value) => ({
  type: types.SET_FILTER_VALUE,
  payload: { filter, value },
})

export const getPreviousPage = () => ({
  type: types.GET_RESULTS_PAGE,
  payload: { page: 'previous' },
})
export const getNextPage = () => ({
  type: types.GET_RESULTS_PAGE,
  payload: { page: 'next' },
})

export const toggleResultSelected = (item) => ({
  type: types.TOGGLE_RESULT_SELECTED,
  payload: { item },
})

export const toggleSelectAllResults = () => ({
  type: types.TOGGLE_SELECT_ALL_RESULTS,
})
