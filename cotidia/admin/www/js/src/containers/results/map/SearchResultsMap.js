import { connect } from 'react-redux'

import SearchResultsMap from '../../../components/results/map/SearchResultsMap'

const mapStateToProps = (state) => ({
  ...state.search.mapConfiguration,
  detailURL: state.search.detailURL,
  loading: state.search.loading,
  results: state.search.results,
})

export default connect(mapStateToProps)(SearchResultsMap)
