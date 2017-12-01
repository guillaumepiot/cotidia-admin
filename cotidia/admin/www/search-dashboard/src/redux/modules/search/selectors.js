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
