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
