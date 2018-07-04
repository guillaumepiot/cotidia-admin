import { connect } from 'react-redux'

import {
  setFilterValue,
  showSidebar,
} from '../redux/modules/search/actions'

import { getSidebarFilters } from '../redux/modules/search/selectors'

import FilterSidebar from '../components/FilterSidebar'

const mapStateToProps = (state) => ({
  filters: state.search.filters,
  sidebarFilters: getSidebarFilters(state),
  hasSidebarFilters: true,
})

const actionCreators = {
  setFilterValue,
  showSidebar,
}

export default connect(mapStateToProps, actionCreators)(FilterSidebar)
