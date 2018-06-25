import { connect } from 'react-redux'

import {
  clearFilters,
  manageColumns,
  performBatchAction,
  performGlobalAction,
  setFilterValue,
  setSearchTerm,
  switchMode,
} from '../redux/modules/search/actions'

import SearchBar from '../components/SearchBar'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  columnsConfigurable: state.config.columnsConfigurable,
  extraFilters: state.search.extraFilters,
  filters: state.search.filters,
  globalActions: state.search.globalActions,
  hasListConfig: state.search.listFields != null,
  mode: state.search.mode,
  searchTerm: state.search.searchTerm,
})

const actionCreators = {
  clearFilters,
  manageColumns,
  performBatchAction,
  performGlobalAction,
  setFilterValue,
  setSearchTerm,
  switchMode,
}

export default connect(mapStateToProps, actionCreators)(SearchBar)
