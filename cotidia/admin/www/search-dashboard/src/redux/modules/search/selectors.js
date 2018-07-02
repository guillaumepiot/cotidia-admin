import { createSelector } from 'reselect'
import { uuid4 } from '../../../utils'

const identity = _ => _

// Create a cached selector as this gets used in a lot of subcomponents
export const getVisibleColumnConfig = createSelector(
  (state) => state.search.visibleColumns,
  (state) => state.search.columns,
  (visibleColumns, columns) => visibleColumns.map(
    (column) => {
      if (columns[column]) {
        return {
          ...columns[column],
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
  (filters) => Object.entries(filters).filter(([key, value]) => value != null).map(([key, value]) => key)
)

export const allResultsSelected = (state) => (state.search.selected.length === state.search.results.length)

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
    if (state.search.columns.hasOwnProperty(filter)) {
      if (state.search.columns[filter].filter) {
        return {
          filter: state.search.columns[filter].filter,
          label: state.search.columns[filter].label,
          name: filter,
          options: state.search.columns[filter].options,
        }
      }
    }
  }).filter(identity)
}

export const getToolbarFilters = (state) => getFiltersArray(state, state.search.toolbarFilters)
export const getSidebarFilters = (state) => getFiltersArray(state, state.search.sidebarFilters)
