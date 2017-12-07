import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Pagination extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    getNextPage: PropTypes.func.isRequired,
    getPreviousPage: PropTypes.func.isRequired,
    next: PropTypes.bool.isRequired,
    previous: PropTypes.bool.isRequired,
  }

  render () {
    return (
      <>
        <div>{this.props.count} results.</div>
        <div className='pagination'>

          <button
            className='pagination__link pagination__link--previous'
            disabled={! this.props.previous}
            onClick={this.props.getPreviousPage}
            type='button'
          >
            Previous Page
          </button>

          <button
            className='pagination__link pagination__link--next'
            disabled={! this.props.next}
            onClick={this.props.getNextPage}
            type='button'
          >
            Next Page
          </button>
        </div>
      </>
    )
  }
}
