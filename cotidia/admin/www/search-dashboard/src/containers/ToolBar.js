import { connect } from 'react-redux'

import {
  clearFilters,
  performBatchAction,
  setFilterValue,
  setSearchTerm,
  toggleSidebar,
} from '../redux/modules/search/actions'

import { getToolbarFilters } from '../redux/modules/search/selectors'

import ToolBar from '../components/ToolBar'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  filters: state.search.filters,
  searchTerm: state.search.searchTerm,
  toolbarFilters: getToolbarFilters(state),
})

const actionCreators = {
  clearFilters,
  performBatchAction,
  setFilterValue,
  setSearchTerm,
  toggleSidebar,
}

export default connect(mapStateToProps, actionCreators)(ToolBar)
