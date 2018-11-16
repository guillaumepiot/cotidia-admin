import { connect } from 'react-redux'

import { gotoPage, setPerPage } from '../redux/modules/search/actions'

import Pagination from '../components/Pagination'

const mapStateToProps = (state) => ({
  ...state.search.pagination,

  perPage: state.search.perPage,

  resultsMeta: state.search.resultsMeta,
  resultsMode: state.search.resultsMode,
})

const actionCreators = { gotoPage, setPerPage }

export default connect(mapStateToProps, actionCreators)(Pagination)
