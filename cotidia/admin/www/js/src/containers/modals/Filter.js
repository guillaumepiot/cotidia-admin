import { connect } from 'react-redux'

import { setFilterValue } from '../../redux/modules/search/actions'

import { cacheFilterLabel } from '../../utils'

import { getSuggestEngine } from '../../utils/filterSuggestEngines'

import Filter from '../../components/modals/Filter'

const mapStateToProps = (state, ownProps) => ({
  cacheFilterLabel,
  config: state.search.filterConfiguration[ownProps.filter],
  filterConfiguration: state.search.filterConfiguration || {},
  getSuggestEngine,
  globalConfig: state.config,
  value: state.search.filters[ownProps.filter],
})

const actionCreators = { setFilterValue }

export default connect(mapStateToProps, actionCreators)(Filter)
