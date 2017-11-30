import { connect } from 'react-redux'

import {
  filterColumn,
  setSearchTerm,
  setOrderColumn,
  toggleOrderDirection,
} from '../redux/modules/search/actions'

import SearchResults from '../components/SearchResults'

const mapStateToProps = (state) => ({
  columns: state.search.columns,
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
