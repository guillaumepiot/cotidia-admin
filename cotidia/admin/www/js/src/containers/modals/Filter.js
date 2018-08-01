import { connect } from 'react-redux'

import { setFilterValue } from '../../redux/modules/search/actions'

import Filter from '../../components/modals/Filter'

const mapStateToProps = (state, ownProps) => ({
  config: state.search.columnConfiguration[ownProps.filter] || state.search.extraFilters[ownProps.filter],
  globalConfig: state.config,
  value: state.search.filters[ownProps.filter],
})

const actionCreators = { setFilterValue }

export default connect(mapStateToProps, actionCreators)(Filter)
