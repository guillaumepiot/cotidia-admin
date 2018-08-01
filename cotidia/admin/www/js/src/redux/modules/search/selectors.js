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
      .filter(([key, value]) => getFilterValue(value) != null)
      .map(([key, value]) => key)
)

export const allResultsSelected = (state) => (state.search.selected.length > 0) && (state.search.selected.length === state.search.results.length)
export const anyResultsSelected = (state) => state.search.selected.length > 0

const getFiltersArray = (state, filters) => {
  if (! filters) {
    return []
  }

  return filters.map((filter) => {
    // First see if the filter is present in the "extraFilters" object.
    if (state.search.extraFilters.hasOwnProperty(filter)) {
      return {
        ...state.search.extraFilters[filter],
        name: filter,
      }
    }

    // If not, see if it's a colmn with that filter
    if (state.search.columnConfiguration.hasOwnProperty(filter)) {
      const columnConfig = state.search.columnConfiguration[filter]

      if (columnConfig.filter) {
        return {
          filter: columnConfig.filter,
          label: columnConfig.label,
          name: filter,
          options: columnConfig.options,
        }
      }
    }
  }).filter(identity)
}

export const getToolbarFilters = (state) => getFiltersArray(state, state.search.toolbarFilters)
export const getSidebarFilters = (state) => getFiltersArray(state, state.search.sidebarFilters)
