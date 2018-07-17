import { connect } from 'react-redux'

import {
  manageColumns,
  switchMode,
} from '../redux/modules/search/actions'

import Header from '../components/Header'

const mapStateToProps = (state) => ({
  columnsConfigurable: state.config.columnsConfigurable,
  hasListConfig: state.search.listFields != null,
  mode: state.search.mode,
  title: state.search.title,
})

const actionCreators = {
  manageColumns,
  switchMode,
}

export default connect(mapStateToProps, actionCreators)(Header)
