import * as types from './types'

export const setSearchTerm = (term) => ({
  type: types.SET_SEARCH_TERM,
  payload: { term },
})

export const filterColumn = (column) => ({
  type: types.FILTER_COLUMN,
  payload: { column },
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
