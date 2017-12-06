import { connect } from 'react-redux'

import {
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
} from '../redux/modules/search/actions'

import { getVisibleColumnConfig } from '../redux/modules/search/selectors'

import SearchResults from '../components/SearchResults'

const mapStateToProps = (state) => ({
  columns: getVisibleColumnConfig(state.search),
  detailURL: state.search.detailURL,
  displayedColumns: state.search.displayedColumns,
  orderAscending: state.search.orderAscending,
  orderColumn: state.search.orderColumn,
  results: state.search.results,
})

const actionCreators = {
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
}

export default connect(mapStateToProps, actionCreators)(SearchResults)
