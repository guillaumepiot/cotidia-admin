const identity = _ => _

export function getVisibleColumnConfig (state) {
  const columns = state.visibleColumns.map(
    (column) => ({
      ...state.columns[column],
      id: column,
      accessor: column,
    })
  )

  return columns.filter(identity)
}

export function getActiveFilters (state) {
  // Filter out any filters that aren't (loosely) equal to null, and then map to the keys.
  return Object.entries(state.filters).filter(([key, value]) => value != null).map(([key, value]) => key)
}
