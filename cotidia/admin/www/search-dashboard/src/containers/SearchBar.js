import { connect } from 'react-redux'

import {
  clearFilters,
  manageColumns,
  performBatchAction,
  setSearchTerm,
  switchMode,
} from '../redux/modules/search/actions'

import SearchBar from '../components/SearchBar'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  searchTerm: state.search.searchTerm,
  hasListConfig: state.search.listFields !== null,
})

const actionCreators = {
  clearFilters,
  manageColumns,
  performBatchAction,
  setSearchTerm,
  switchMode,
}

export default connect(mapStateToProps, actionCreators)(SearchBar)
