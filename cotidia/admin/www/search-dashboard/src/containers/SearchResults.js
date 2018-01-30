import { connect } from 'react-redux'

import {
  clearFilter,
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
  toggleResultSelected,
  toggleSelectAllResults,
} from '../redux/modules/search/actions'

import { getVisibleColumnConfig, getActiveFilters } from '../redux/modules/search/selectors'

import SearchResults from '../components/SearchResults'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  columns: getVisibleColumnConfig(state),
  detailURL: state.search.detailURL,
  displayedColumns: state.search.displayedColumns,
  filters: getActiveFilters(state),
  loading: state.search.loading,
  orderAscending: state.search.orderAscending,
  orderColumn: state.search.orderColumn,
  results: state.search.results,
  selected: state.search.selected,
})

const actionCreators = {
  clearFilter,
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
  toggleResultSelected,
  toggleSelectAllResults,
}

export default connect(mapStateToProps, actionCreators)(SearchResults)
