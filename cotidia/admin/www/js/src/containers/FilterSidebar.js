import { connect } from 'react-redux'

import {
  setFilterValue,
  showSidebar,
} from '../redux/modules/search/actions'

import { getSidebarFilters } from '../redux/modules/search/selectors'

import { cacheFilterLabel } from '../utils'

import { getSuggestEngine } from '../utils/filterSuggestEngines'

import FilterSidebar from '../components/FilterSidebar'

const mapStateToProps = (state) => ({
  cacheFilterLabel: cacheFilterLabel,
  filterConfiguration: state.search.filterConfiguration || {},
  filters: state.search.filters,
  getSuggestEngine,
  hasSidebarFilters: true,
  sidebarFilters: getSidebarFilters(state),
})

const actionCreators = {
  setFilterValue,
  showSidebar,
}

export default connect(mapStateToProps, actionCreators)(FilterSidebar)
