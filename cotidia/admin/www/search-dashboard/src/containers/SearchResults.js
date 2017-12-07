import { connect } from 'react-redux'

import {
  clearFilter,
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
} from '../redux/modules/search/actions'

import { getVisibleColumnConfig, getActiveFilters } from '../redux/modules/search/selectors'

import SearchResults from '../components/SearchResults'

const mapStateToProps = (state) => ({
  columns: getVisibleColumnConfig(state.search),
  detailURL: state.search.detailURL,
  displayedColumns: state.search.displayedColumns,
  filters: getActiveFilters(state.search),
  orderAscending: state.search.orderAscending,
  orderColumn: state.search.orderColumn,
  results: state.search.results,
})

const actionCreators = {
  clearFilter,
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
}

export default connect(mapStateToProps, actionCreators)(SearchResults)
