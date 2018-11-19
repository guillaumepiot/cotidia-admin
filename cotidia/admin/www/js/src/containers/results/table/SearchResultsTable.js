import { connect } from 'react-redux'

import { getVisibleColumnConfig } from '../../../redux/modules/search/selectors'

import SearchResultsTable from '../../../components/results/table/SearchResultsTable'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  categoriseBy: state.search.categoriseBy,
  columns: getVisibleColumnConfig(state),
  config: state.config,
  loading: state.search.loading,
  results: state.search.results,
})

export default connect(mapStateToProps)(SearchResultsTable)
