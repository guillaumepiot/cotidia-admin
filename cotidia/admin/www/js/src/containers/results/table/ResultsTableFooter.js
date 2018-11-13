import { connect } from 'react-redux'

import { getVisibleColumnConfig } from '../../../redux/modules/search/selectors'

import ResultsTableFooter from '../../../components/results/table/ResultsTableFooter'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  columns: getVisibleColumnConfig(state),
  config: state.config,
  results: state.search.results,
})

export default connect(mapStateToProps)(ResultsTableFooter)
