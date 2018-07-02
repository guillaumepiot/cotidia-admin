import { connect } from 'react-redux'

import { performGlobalAction } from '../redux/modules/search/actions'

import GlobalActions from '../components/GlobalActions'

const mapStateToProps = (state) => ({
  globalActions: state.search.globalActions,
})

const actionCreators = { performGlobalAction }

export default connect(mapStateToProps, actionCreators)(GlobalActions)
