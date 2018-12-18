import { connect } from 'react-redux'

import {
  cacheFilterLabel,
  setFilterValue,
  showSidebar,
} from '../redux/modules/search/actions'

import { getSidebarFilters } from '../redux/modules/search/selectors'

import { getSuggestEngine } from '../utils/filterSuggestEngines'

import FilterSidebar from '../components/FilterSidebar'

const mapStateToProps = (state) => {
  const sidebarFilters = getSidebarFilters(state)

  return {
    filterConfiguration: state.search.filterConfiguration || {},
    filters: state.search.filters,
    getSuggestEngine,
    hasSidebarFilters: sidebarFilters.length > 0,
    sidebarFilters,
  }
}

const actionCreators = {
  cacheFilterLabel,
  setFilterValue,
  showSidebar,
}

export default connect(mapStateToProps, actionCreators)(FilterSidebar)
