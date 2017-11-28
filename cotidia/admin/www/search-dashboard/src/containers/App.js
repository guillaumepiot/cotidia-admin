import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import App from '../components/App'

const mapStateToProps = (state) => ({
  bootstrapped: state.bootstrap.bootstrapped,
  networkError: state.bootstrap.networkError,
})

export default withRouter(connect(mapStateToProps)(App))
