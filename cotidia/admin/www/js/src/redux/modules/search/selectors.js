import { createSelector } from 'reselect'
import { uuid4 } from '../../../utils'
import { getFilterValue } from './sagas'

const identity = _ => _

// Create a cached selector as this gets used in a lot of subcomponents
export const getVisibleColumnConfig = createSelector(
  (state) => state.search.visibleColumns,
  (state) => state.search.columnConfiguration,
  (visibleColumns, columnConfiguration) => visibleColumns.map(
    (column) => {
      if (columnConfiguration[column]) {
        return {
          ...columnConfiguration[column],
          id: column,
          accessor: column,
          type: 'data',
        }
      }

      if (column === '_separator') {
        return {
          id: uuid4(),
          type: 'separator',
        }
      }
    }
  ).filter(identity)
)

// Filter out any filters that aren't (loosely) equal to null, and then map to the keys.
export const getActiveFilters = createSelector(
  (state) => state.search.filters,
  (filters) =>
    Object.entries(filters)
      .filter(([, value]) => getFilterValue(value) != null)
      .map(([key]) => key)
)

export const allResultsSelected = (state) => (state.search.selected.length > 0) && (state.search.selected.length === state.search.results.length)
export const anyResultsSelected = (state) => state.search.selected.length > 0

const getFiltersArray = (state, filters) => {
  if (! filters) {
    return []
  }

  return filters.map((filter) => {
    if (state.search.filterConfiguration.hasOwnProperty(filter)) {
      return {
        ...state.search.filterConfiguration[filter],
        name: filter,
      }
    }
  }).filter(identity)
}

export const getToolbarFilters = (state) => getFiltersArray(state, state.search.toolbarFilters)
export const getSidebarFilters = (state) => getFiltersArray(state, state.search.sidebarFilters)
