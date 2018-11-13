import { connect } from 'react-redux'

import { setSearchTerm } from '../redux/modules/search/actions'

import DynamicList from '../components/DynamicList'

const mapStateToProps = (state) => ({
  bootstrapped: state.bootstrap.bootstrapped,
  networkError: state.bootstrap.networkError,

  resultsMode: state.search.resultsMode,

  hasSidebar: state.search.sidebarFilters && state.search.sidebarFilters.length > 0,
  showSidebar: state.search.showSidebar,

  title: state.search.title,
})

const actionCreators = { setSearchTerm }

export default connect(mapStateToProps, actionCreators)(DynamicList)
