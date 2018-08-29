import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

export default class Pagination extends Component {
  static propTypes = {
    gotoPage: PropTypes.func.isRequired,
    page: PropTypes.number,
    pageCount: PropTypes.number.isRequired,
    pageResultCount: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    setPerPage: PropTypes.func.isRequired,
    totalResultsCount: PropTypes.number.isRequired,
  }

  gotoPreviousPage = () => this.props.gotoPage(Math.max(1, this.props.page - 1))
  gotoNextPage = () => this.props.gotoPage(Math.min(this.props.pageCount, this.props.page + 1))

  setPerPage = (e) => this.props.setPerPage(Number(e.target.value))

  render () {
    const {
      page,
      pageCount,
      pageResultCount,
      perPage,
      totalResultsCount,
    } = this.props

    if (! page) {
      return null
    }

    return (
      <div className='content-foot__left' style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <button
            className='btn btn--link'
            disabled={page === 1}
            onClick={this.gotoPreviousPage}
            type='button'
          >
            <Icon icon='chevron-left' />
          </button>

          Page {page} of {pageCount}

          <button
            className='btn btn--link'
            disabled={page === pageCount}
            onClick={this.gotoNextPage}
            type='button'
          >
            <Icon icon='chevron-right' />
          </button>
        </div>

        <div style={{ marginLeft: '2rem' }}>
          Showing {pageResultCount} of {totalResultsCount} results
        </div>

        <div style={{ marginLeft: '2rem' }}>
          Results per page:
          {' '}
          <select value={perPage} onChange={this.setPerPage}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>
    )
  }
}
