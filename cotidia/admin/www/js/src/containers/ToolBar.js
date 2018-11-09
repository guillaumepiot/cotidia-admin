import { connect } from 'react-redux'

import {
  clearFilters,
  manageColumns,
  performBatchAction,
  removeFilterValue,
  setFilterValue,
  setSearchTerm,
  switchMode,
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
    columnsConfigurable: state.config.columnsConfigurable,
    filterConfiguration: state.search.filterConfiguration || {},
    filters: state.search.filters,
    hasListConfig: state.search.listFields != null,
    hasSidebar: state.search?.sidebarFilters.length > 0,
    getSuggestEngine,
    mode: state.search.mode,
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
  manageColumns,
  performBatchAction,
  removeFilterValue,
  setFilterValue,
  setSearchTerm,
  switchMode,
  toggleSidebar,
}

export default connect(mapStateToProps, actionCreators)(ToolBar)
