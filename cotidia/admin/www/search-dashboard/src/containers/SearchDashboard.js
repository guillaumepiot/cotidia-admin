import { connect } from 'react-redux'

import { setSearchTerm } from '../redux/modules/search/actions'

import SearchDashboard from '../components/SearchDashboard'

const mapStateToProps = (state) => ({
  bootstrapped: state.bootstrap.bootstrapped,
  networkError: state.bootstrap.networkError,
})

const actionCreators = { setSearchTerm }

export default connect(mapStateToProps, actionCreators)(SearchDashboard)
