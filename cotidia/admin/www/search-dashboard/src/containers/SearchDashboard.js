import { connect } from 'react-redux'

import { setSearchTerm } from '../redux/modules/search/actions'

import SearchDashboard from '../components/SearchDashboard'

const mapStateToProps = (state) => ({
  bootstrapped: state.bootstrap.bootstrapped,
  networkError: state.bootstrap.networkError,

  searchMode: state.search.mode,
  hasListConfig: state.search.listFields !== null,
})

const actionCreators = { setSearchTerm }

export default connect(mapStateToProps, actionCreators)(SearchDashboard)
