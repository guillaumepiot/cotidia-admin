import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ResultsListItem from './ResultsListItem'
import Pagination from '../../../containers/Pagination'

export default class SearchResultsList extends Component {
  static propTypes = {
    batchActions: PropTypes.arrayOf(PropTypes.object),
    columnConfiguration: PropTypes.object.isRequired,
    config: PropTypes.object,
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

  getItemURL (item) {
    if (this.props.config.detailURLField) {
      const url = item[this.props.config.detailURLField]

      if (typeof url === 'string' && url.length) {
        return url
      }
    }

    return null
  }

  viewItem = (item, newWindow) => {
    const url = this.getItemURL(item)

    if (! url) {
      return
    }

    if (newWindow) {
      window.open(url)
    } else {
      window.location = url
    }
  }

  checkItem = (item) => this.props.toggleResultSelected(item.uuid)

  render () {
    const {
      batchActions,
      columnConfiguration,
      config,
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
              viewItem={this.getItemURL(item) ? this.viewItem : null}
            />
          ))}
        </div>
      </>
    )
  }
}
