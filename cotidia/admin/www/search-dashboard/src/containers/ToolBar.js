import { connect } from 'react-redux'

import {
  clearFilters,
  performBatchAction,
  setFilterValue,
  setSearchTerm,
  toggleSidebar,
} from '../redux/modules/search/actions'

import ToolBar from '../components/ToolBar'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  extraFilters: state.search.extraFilters,
  filters: state.search.filters,
  searchTerm: state.search.searchTerm,
})

const actionCreators = {
  clearFilters,
  performBatchAction,
  setFilterValue,
  setSearchTerm,
  toggleSidebar,
}

export default connect(mapStateToProps, actionCreators)(ToolBar)
