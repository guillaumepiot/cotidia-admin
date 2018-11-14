import { connect } from 'react-redux'

import { removeFilterValue } from '../redux/modules/search/actions'

import FilterTagBar from '../components/FilterTagBar'

const mapStateToProps = (state) => {
  const props = {
    config: state.config,
    filterConfiguration: state.search.filterConfiguration || {},
    filters: state.search.filters,
  }

  return props
}

const actionCreators = { removeFilterValue }

export default connect(mapStateToProps, actionCreators)(FilterTagBar)
