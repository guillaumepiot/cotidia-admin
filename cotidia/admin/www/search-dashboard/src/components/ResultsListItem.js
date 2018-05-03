import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { getFormattedValue } from '../utils/resultItems'

// Normally we wouldn't bother with perf optimisation, but this takes a render of 250 items down
// from 130ms to 25-30ms when only one of the items changes (e.g. select an item).
export default class ResultsListItem extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    checkItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    showCheck: PropTypes.bool.isRequired,
    viewItem: PropTypes.func.isRequired,
    listFields: PropTypes.any,
  }

  handleClickRow = () => {
    if (this.props.viewItem) {
      this.props.viewItem(this.props.item)
    } else if (this.props.showCheck) {
      this.props.checkItem(this.props.item)
    }
  }

  checkItem = (e) => {
    e.stopPropagation()
    this.props.checkItem(this.props.item)
  }

  render () {
    const { checked, item, showCheck, listFields } = this.props

    return (
      <div className='search-result-list__item search-result-item' onClick={this.handleClickRow}>
        {showCheck && (
          <div className='search-result-item__checkbox' onClick={this.checkItem}>
            <input type='checkbox' checked={checked} />
          </div>
        )}
        {listFields.left && (
          <div className='search-result-item__left'>
            {listFields.left.top && (
              <div className='search-result-item__top-left'>{getFormattedValue(item, listFields.left.top, 'verbatim')}</div>
            )}
            {listFields.left.bottom && (
              <div className='search-result-item__bottom-left'>{getFormattedValue(item, listFields.left.bottom, 'verbatim')}</div>
            )}
          </div>
        )}
        {listFields.right && (
          <div className='search-result-item__right'>
            {listFields.right.top && (
              <div className='search-result-item__top-right'>{getFormattedValue(item, listFields.right.top, 'verbatim')}</div>
            )}
            {listFields.right.bottom && (
              <div className='search-result-item__bottom-right'>{getFormattedValue(item, listFields.right.bottom, 'verbatim')}</div>
            )}
          </div>
        )}
      </div>
    )
  }
}
