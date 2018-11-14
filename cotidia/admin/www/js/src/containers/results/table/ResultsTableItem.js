import { connect } from 'react-redux'

import { toggleResultSelected } from '../../../redux/modules/search/actions'

import { getVisibleColumnConfig } from '../../../redux/modules/search/selectors'

import ResultsTableItem from '../../../components/results/table/ResultsTableItem'

const mapStateToProps = (state, props) => ({
  checked: state.search.selected.includes(props.item.uuid),
  columns: getVisibleColumnConfig(state),
  detailURL: state.search.detailURL,
  showCheck: state.search.batchActions.length > 0,
})

const actionCreators = { toggleResultSelected }

export default connect(mapStateToProps, actionCreators)(ResultsTableItem)
