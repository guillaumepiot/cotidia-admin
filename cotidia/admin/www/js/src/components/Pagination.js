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
    resultsMeta: PropTypes.object.isRequired,
    resultsMode: PropTypes.string.isRequired,
    setPerPage: PropTypes.func.isRequired,
    totalResultsCount: PropTypes.number.isRequired,
  }

  gotoPreviousPage = () => this.props.gotoPage(Math.max(1, this.props.page - 1))
  gotoNextPage = () => this.props.gotoPage(Math.min(this.props.pageCount, this.props.page + 1))

  setPerPage = (e) => this.props.setPerPage(Number(e.target.value))

  renderSimpleContent (content) {
    return (
      <div className='content-foot__left'>
        {content}
      </div>
    )
  }

  render () {
    const {
      page,
      pageCount,
      pageResultCount,
      perPage,
      resultsMeta,
      resultsMode,
      totalResultsCount,
    } = this.props

    // Snake case because Python conventions.
    if (resultsMeta.footer_info) {
      return this.renderSimpleContent(resultsMeta.footer_info)
    }

    if (! page) {
      return null
    }

    if (resultsMode === 'map') {
      return this.renderSimpleContent(`Showing ${pageResultCount} results`)
    }

    return (
      <div className='content-foot__left'>
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
              <Icon className='pagination__icon' icon='chevron-left' />
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
              <Icon className='pagination__icon' icon='chevron-right' />
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
