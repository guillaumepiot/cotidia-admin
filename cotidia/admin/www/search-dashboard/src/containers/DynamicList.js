import { connect } from 'react-redux'

import { setSearchTerm } from '../redux/modules/search/actions'

import DynamicList from '../components/DynamicList'

const mapStateToProps = (state) => ({
  bootstrapped: state.bootstrap.bootstrapped,
  networkError: state.bootstrap.networkError,

  searchMode: state.search.mode,
  hasListConfig: state.search.listFields != null,

  showSidebar: state.search.showSidebar,
})

const actionCreators = { setSearchTerm }

export default connect(mapStateToProps, actionCreators)(DynamicList)
