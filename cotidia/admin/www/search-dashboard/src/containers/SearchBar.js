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
  hasListConfig: state.search.listFields !== null,
  mode: state.search.mode,
  searchTerm: state.search.searchTerm,
})

const actionCreators = {
  clearFilters,
  manageColumns,
  performBatchAction,
  setSearchTerm,
  switchMode,
}

export default connect(mapStateToProps, actionCreators)(SearchBar)
