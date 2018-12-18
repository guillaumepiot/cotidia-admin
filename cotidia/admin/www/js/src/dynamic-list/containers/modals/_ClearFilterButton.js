import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { clearFilter } from '../../redux/modules/search/actions'

function ClearFilterButton ({ clearFilter, filter }) {
  return (
    <button
      type='button'
      className='btn btn--change'
      onClick={() => clearFilter(filter)}
    >
      Clear filter
    </button>
  )
}

ClearFilterButton.propTypes = {
  clearFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
}

const actionCreators = { clearFilter }

export default connect(null, actionCreators)(ClearFilterButton)
