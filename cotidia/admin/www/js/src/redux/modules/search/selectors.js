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

// Pluck a filter by name from the filterconfig and also add its name into its config. If it doesn't
// exist, return undefined.
const getFilter = (state, filter) => {
  if (state.search.filterConfiguration.hasOwnProperty(filter)) {
    return {
      ...state.search.filterConfiguration[filter],
      name: filter,
    }
  }
}

const getFilters = (state, filters) => {
  if (! filters) {
    return []
  }

  const getFilterForState = getFilter.bind(null, state)

  const newFilters = []

  for (const filterOrGroup of filters) {
    if (filterOrGroup.hasOwnProperty('filters')) {
      newFilters.push({
        ...filterOrGroup,
        filters: filterOrGroup.filters.map(getFilterForState).filter(identity),
      })
    } else {
      const filter = getFilterForState(filterOrGroup)

      if (filter) {
        newFilters.push(filter)
      }
    }
  }

  return newFilters
}

// Toolbar filters have no concept of filter groups, so just smush them all together.
export const getToolbarFilters = (state) => getFilters(state, state.search.toolbarFilters).flatMap(
  (filterOrGroup) => filterOrGroup.filters || filterOrGroup
)

export const getSidebarFilters = (state) => getFilters(state, state.search.sidebarFilters)
