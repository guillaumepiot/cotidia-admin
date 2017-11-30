import { connect } from 'react-redux'

import { setSearchTerm } from '../redux/modules/search/actions'

import SearchBar from '../components/SearchBar'

const mapStateToProps = (state) => ({
  searchTerm: state.search.searchTerm,
})

const actionCreators = { setSearchTerm }

export default connect(mapStateToProps, actionCreators)(SearchBar)
