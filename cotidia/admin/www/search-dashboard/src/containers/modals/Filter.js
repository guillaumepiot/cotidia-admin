import { connect } from 'react-redux'

// import { setFilter } from '../redux/modules/search/actions'

import Filter from '../../components/modals/Filter'

const mapStateToProps = (state) => ({
  columns: state.search.columns,
})

// const actionCreators = { setFilter }

export default connect(mapStateToProps)(Filter)
