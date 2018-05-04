import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { generateURL } from '../utils/api'

import ResultsListItem from './ResultsListItem'
import Pagination from '../containers/Pagination'

export default class SearchResultsList extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.object.isRequired,
    detailURL: PropTypes.string,
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
    results: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.arrayOf(PropTypes.string),
    toggleResultSelected: PropTypes.func.isRequired,
  }

  viewItem = (item) => {
    if (this.props.detailURL) {
      window.location = generateURL(this.props.detailURL, item)
    }
  }

  checkItem = (item) => this.props.toggleResultSelected(item.uuid)

  render () {
    const {
      batchActions,
      columns,
      detailURL,
      results,
      selected,
      listFields,
    } = this.props

    return (
      <>
        <div className='search-result-list'>
          {results.map((item) => (
            <ResultsListItem
              checked={selected.includes(item.uuid)}
              checkItem={this.checkItem}
              columns={columns}
              key={item.uuid}
              item={item}
              showCheck={batchActions.length > 0}
              listFields={listFields}
              viewItem={detailURL ? this.viewItem : null}
            />
          ))}
        </div>

        <Pagination />
      </>
    )
  }
}
