import { connect } from 'react-redux'

import { gotoPage, setPerPage } from '../redux/modules/search/actions'

import Pagination from '../components/Pagination'

const mapStateToProps = (state) => ({
  ...state.search.pagination,
  perPage: state.search.perPage,
})

const actionCreators = { gotoPage, setPerPage }

export default connect(mapStateToProps, actionCreators)(Pagination)
