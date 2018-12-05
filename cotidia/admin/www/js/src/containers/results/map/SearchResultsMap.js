import { connect } from 'react-redux'

import { showDetailModal } from '../../../redux/modules/search/actions'

import SearchResultsMap from '../../../components/results/map/SearchResultsMap'

const mapStateToProps = (state) => ({
  ...state.search.mapConfiguration,
  detailConfig: state.config.detailConfig,
  results: state.search.results,
})

const actionCreators = {
  showDetailModal,
}

export default connect(mapStateToProps, actionCreators)(SearchResultsMap)
