import { connect } from 'react-redux'

import { resetColumns, toggleColumn } from '../../redux/modules/search/actions'

import ManageColumns from '../../components/modals/ManageColumns'

const mapStateToProps = (state) => ({
  columns: state.search.columns,
  visibleColumns: state.search.visibleColumns,
})

const actionCreators = { resetColumns, toggleColumn }

export default connect(mapStateToProps, actionCreators)(ManageColumns)
