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

import * as filterSuggestEngines from '../utils/filterSuggestEngines'

import ToolBar from '../components/ToolBar'

const mapStateToProps = (state) => {
  const props = {
    anyResultsSelected: anyResultsSelected(state),
    batchActions: state.search.batchActions,
    filters: state.search.filters,
    hasSidebar: state.search?.sidebarFilters.length > 0,
  }
  if (state.search?.filterSuggestConfiguration?.mode) {
    props.config = state.config
    props.filterSuggest = filterSuggestEngines[state.search.filterSuggestConfiguration.mode](state.search.filterSuggestConfiguration)
    props.filterConfiguration = state.search?.filterConfiguration || {}
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
