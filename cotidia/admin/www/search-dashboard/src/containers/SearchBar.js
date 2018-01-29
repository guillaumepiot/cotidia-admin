import { connect } from 'react-redux'

import {
  clearFilters,
  manageColumns,
  performBatchAction,
  setSearchTerm,
} from '../redux/modules/search/actions'

import SearchBar from '../components/SearchBar'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  searchTerm: state.search.searchTerm,
})

const actionCreators = {
  clearFilters,
  manageColumns,
  performBatchAction,
  setSearchTerm,
}

export default connect(mapStateToProps, actionCreators)(SearchBar)
