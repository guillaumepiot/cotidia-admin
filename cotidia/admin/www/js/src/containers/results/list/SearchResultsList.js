import { connect } from 'react-redux'

import { toggleResultSelected } from '../../../redux/modules/search/actions'

import SearchResultsList from '../../../components/results/list/SearchResultsList'

const mapStateToProps = (state) => ({
  batchActions: state.search.batchActions,
  columnConfiguration: state.search.columnConfiguration,
  config: state.config,
  detailURL: state.search.detailURL,
  listFields: state.search.listFields,
  loading: state.search.loading,
  results: state.search.results,
  selected: state.search.selected,
})

const actionCreators = {
  toggleResultSelected,
}

export default connect(mapStateToProps, actionCreators)(SearchResultsList)
