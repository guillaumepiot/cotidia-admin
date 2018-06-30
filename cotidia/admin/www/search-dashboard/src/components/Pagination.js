import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

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
      <div className='content__pagination'>
        <button
          className='btn btn--link'
          disabled={! this.props.previous}
          onClick={this.props.getPreviousPage}
          type='button'
        >
          <Icon icon='chevron-left' />
        </button>
        {this.props.count} results
        <button
          className='btn btn--link'
          disabled={! this.props.next}
          onClick={this.props.getNextPage}
          type='button'
        >
          <Icon icon='chevron-right' />
        </button>
      </div>
    )
  }
}
