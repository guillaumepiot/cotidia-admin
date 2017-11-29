import { connect } from 'react-redux'

import SearchDashboard from '../components/SearchDashboard'

const mapStateToProps = (state) => ({
  bootstrapped: state.bootstrap.bootstrapped,
  networkError: state.bootstrap.networkError,
})

export default connect(mapStateToProps)(SearchDashboard)
