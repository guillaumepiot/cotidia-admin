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
        <div className='pagination'>
          <div className='pagination__subsection'>
            <button
              aria-label='Previous'
              className='pagination__link pagination__link--prev'
              disabled={page === 1}
              onClick={this.gotoPreviousPage}
              title='Previous'
              type='button'
            >
              <Icon icon='chevron-left' />
            </button>

            Page {page} of {pageCount}

            <button
              aria-label='Next'
              className='pagination__link pagination__link--next'
              disabled={page === pageCount}
              onClick={this.gotoNextPage}
              title='Next'
              type='button'
            >
              <Icon icon='chevron-right' />
            </button>
          </div>

          <div className='pagination__subsection hidden-mobile'>
            Showing {pageResultCount} of {totalResultsCount} results
          </div>

          <div className='pagination__subsection result-count-form hidden-mobile'>
            <div className='form__group form__group--boxed form__group--boxed'>
              <label className='result-count-form__label' htmlFor='results-per-page'>
                Results per page:
              </label>
              {' '}
              <div className='form__control form__control--select'>
                <select className='form__select' value={perPage} onChange={this.setPerPage}>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                  <option value={150}>150</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
