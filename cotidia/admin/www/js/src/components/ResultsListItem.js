import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../utils/resultItems'

// Normally we wouldn't bother with perf optimisation, but this takes a render of 250 items down
// from 130ms to 25-30ms when only one of the items changes (e.g. select an item).
export default class ResultsListItem extends Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    checkItem: PropTypes.func.isRequired,
    columnConfiguration: PropTypes.object.isRequired,
    config: PropTypes.object,
    item: PropTypes.object.isRequired,
    listFields: PropTypes.shape({
      left: PropTypes.shape({
        top: PropTypes.string,
        bottom: PropTypes.string,
      }),
      right: PropTypes.shape({
        top: PropTypes.string,
        bottom: PropTypes.string,
      }),
    }),
    showCheck: PropTypes.bool.isRequired,
    viewItem: PropTypes.func.isRequired,
  }

  handleClickRow = (e) => {
    if (this.props.viewItem) {
      this.props.viewItem(this.props.item, e.metaKey || e.ctrlKey || e.shiftKey)
    } else if (this.props.showCheck) {
      this.props.checkItem(this.props.item)
    }
  }

  checkItem = (e) => {
    e.stopPropagation()
    this.props.checkItem(this.props.item)
  }

  getColumnConfig = (columnName) => ({
    accessor: columnName,
    display: this.props.columnConfiguration?.[columnName]?.display,
    listHandling: this.props.columnConfiguration?.[columnName]?.listHandling,
  })

  render () {
    const { checked, config, item, showCheck, listFields } = this.props

    const formatValue = getValueFormatter(config)

    let lt, lb, rt, rb

    if (listFields.left?.top) {
      lt = this.getColumnConfig(listFields.left.top)
    }
    if (listFields.left?.bottom) {
      lb = this.getColumnConfig(listFields.left.bottom)
    }
    if (listFields.right?.top) {
      rt = this.getColumnConfig(listFields.right.top)
    }
    if (listFields.right?.bottom) {
      rb = this.getColumnConfig(listFields.right.bottom)
    }

    return (
      <div
        className={`search-result-list__item search-result-item ${this.props.viewItem || this.props.showCheck ? 'search-result-list__item--clickable' : ''}`}
        onClick={this.handleClickRow}
      >
        {showCheck && (
          <div className='search-result-item__checkbox' onClick={this.checkItem}>
            <input type='checkbox' checked={checked} />
          </div>
        )}
        {(lt || lb) && (
          <div className='search-result-item__left'>
            {lt && (
              <div className='search-result-item__top-left'>{formatValue(item, lt.accessor, lt.display, lt.listHandling)}</div>
            )}
            {lb && (
              <div className='search-result-item__bottom-left'>{formatValue(item, lb.accessor, lb.display, lb.listHandling)}</div>
            )}
          </div>
        )}
        {(rt || rb) && (
          <div className='search-result-item__right'>
            {rt && (
              <div className='search-result-item__top-right'>{formatValue(item, rt.accessor, rt.display, rt.listHandling)}</div>
            )}
            {rb && (
              <div className='search-result-item__bottom-right'>{formatValue(item, rb.accessor, rb.display, rb.listHandling)}</div>
            )}
          </div>
        )}
      </div>
    )
  }
}
