import { connect } from 'react-redux'

import { cacheFilterLabel, setFilterValue } from '../../redux/modules/search/actions'

import { getSuggestEngine } from '../../utils/filterSuggestEngines'

import Filter from '../../components/modals/Filter'

const mapStateToProps = (state, ownProps) => ({
  config: state.search.filterConfiguration[ownProps.filter],
  filterConfiguration: state.search.filterConfiguration || {},
  getSuggestEngine,
  globalConfig: state.config,
  value: state.search.filters[ownProps.filter],
})

const actionCreators = { cacheFilterLabel, setFilterValue }

export default connect(mapStateToProps, actionCreators)(Filter)
