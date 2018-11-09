import { connect } from 'react-redux'

import {
  clearFilters,
  performBatchAction,
  removeFilterValue,
  setFilterValue,
  setSearchTerm,
  toggleSidebar,
} from '../redux/modules/search/actions'

import {
  anyResultsSelected,
  getToolbarFilters,
} from '../redux/modules/search/selectors'

import { cacheFilterLabel } from '../utils'

import { getSuggestEngine } from '../utils/filterSuggestEngines'

import ToolBar from '../components/ToolBar'

const mapStateToProps = (state) => {
  const props = {
    anyResultsSelected: anyResultsSelected(state),
    batchActions: state.search.batchActions,
    cacheFilterLabel,
    filterConfiguration: state.search.filterConfiguration || {},
    filters: state.search.filters,
    hasSidebar: state.search?.sidebarFilters.length > 0,
    getSuggestEngine,
  }
  if (state.search?.filterSuggestConfiguration?.mode) {
    props.config = state.config
    props.filterSuggest = getSuggestEngine(
      state.search.filterSuggestConfiguration,
      state.search.filterConfiguration,
      true
    )
  } else {
    props.searchTerm = state.search.searchTerm
    props.toolbarFilters = getToolbarFilters(state)
  }

  return props
}

const actionCreators = {
  clearFilters,
  performBatchAction,
  removeFilterValue,
  setFilterValue,
  setSearchTerm,
  toggleSidebar,
}

export default connect(mapStateToProps, actionCreators)(ToolBar)
