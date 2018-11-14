import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { generateURL } from '../../../utils/api'

import ResultsListItem from './ResultsListItem'
import Pagination from '../../../containers/Pagination'

export default class SearchResultsList extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.object),
    columnConfiguration: PropTypes.object.isRequired,
    config: PropTypes.object,
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
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.arrayOf(PropTypes.string),
    toggleResultSelected: PropTypes.func.isRequired,
  }

  viewItem = (item, newWindow) => {
    if (this.props.detailURL) {
      const url = generateURL(this.props.detailURL, item)

      if (newWindow) {
        window.open(url)
      } else {
        window.location = url
      }
    }
  }

  checkItem = (item) => this.props.toggleResultSelected(item.uuid)

  render () {
    const {
      batchActions,
      columnConfiguration,
      config,
      detailURL,
      loading,
      results,
      selected,
      listFields,
    } = this.props

    return (
      <>
        <div className={`search-result-list ${loading ? 'search-result-list--loading' : ''}`}>
          {results.map((item) => (
            <ResultsListItem
              checked={selected.includes(item.uuid)}
              checkItem={this.checkItem}
              columnConfiguration={columnConfiguration}
              config={config}
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
