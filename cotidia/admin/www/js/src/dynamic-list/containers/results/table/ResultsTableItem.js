import { connect } from 'react-redux'

import { showDetailModal, toggleResultSelected } from '../../../redux/modules/search/actions'

import { getVisibleColumnConfig } from '../../../redux/modules/search/selectors'

import ResultsTableItem from '../../../components/results/table/ResultsTableItem'

const mapStateToProps = (state, props) => ({
  checked: state.search.selected.includes(props.item.uuid),
  columns: getVisibleColumnConfig(state),
  detailConfig: state.config.detailConfig,
  showCheck: state.search.batchActions.length > 0,
})

const actionCreators = {
  showDetailModal,
  toggleResultSelected,
}

export default connect(mapStateToProps, actionCreators)(ResultsTableItem)
