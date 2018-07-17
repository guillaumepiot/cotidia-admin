import { connect } from 'react-redux'

import { getPreviousPage, getNextPage } from '../redux/modules/search/actions'

import Pagination from '../components/Pagination'

const mapStateToProps = (state) => ({
  count: state.search.pagination.count,
  previous: Boolean(state.search.pagination.previous),
  next: Boolean(state.search.pagination.next),
})

const actionCreators = { getPreviousPage, getNextPage }

export default connect(mapStateToProps, actionCreators)(Pagination)
