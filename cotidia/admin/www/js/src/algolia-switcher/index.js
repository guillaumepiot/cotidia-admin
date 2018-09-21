import React, { Component } from 'react'
import PropTypes from 'prop-types'

import algoliasearch from 'algoliasearch/lite'

import { Select } from '@cotidia/react-ui'

function humaniseSnakeCase (snaked) {
  snaked = snaked.replace(/_./g, function (match) {
    return ` ${match[1].toUpperCase()}`
  })

  snaked = snaked[0].toUpperCase() + snaked.slice(1)

  return snaked
}

export default class AlgoliaSwitcher extends Component {
  static propTypes = {
    algoliaIndexes: PropTypes.arrayOf(PropTypes.string).isRequired,
    algoliaAPIKey: PropTypes.string.isRequired,
    algoliaAppId: PropTypes.string.isRequired,
    algoliaFilters: PropTypes.arrayOf(PropTypes.string),
    extraGroupClasses: PropTypes.arrayOf(PropTypes.string),
    minchars: PropTypes.number,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    minchars: 1,
    placeholder: '',
  }

  state = {
    options: [],
  }

  searchID = null

  constructor (props) {
    super(props)

    if (this.algolia) {
      this.algolia = null
    }

    this.algolia = algoliasearch(props.algoliaAppId, props.algoliaAPIKey)
  }

  componentWillReceiveProps (nextProps) {
    if (
      nextProps.algoliaAppId !== this.props.algoliaAppId ||
      nextProps.algoliaAPIKey !== this.props.algoliaAPIKey
    ) {
      this.algolia = algoliasearch(nextProps.algoliaAppId, nextProps.algoliaAPIKey)
    }
  }

  searchOptions = (q) => {
    const searchId = Math.random()
    this.searchId = searchId

    // First set our state to searching and clear the current options.
    this.setState({
      options: [],
      searching: true,
    })

    // Now fire off the suggestion lookup.

    return new Promise((resolve, reject) => {
      const queries = this.props.algoliaIndexes.map((index) => ({
        indexName: index,
        query: q,
        params: this.props.algoliaFilters && {
          filters: this.props.algoliaFilters.join(' OR '),
        },
      }))

      this.algolia.search(queries, (err, content) => {
        // If this is for an old search, just return immediately - we have nothing to do here.
        if (searchId !== this.searchId) {
          return
        }

        // As soon as something comes back, regardless of result, say we're no longer searching.
        this.setState({ searching: false })

        if (err) {
          console.error(err)
          return reject(err)
        }

        let options = []

        for (const index of content.results) {
          options = options.concat(index.hits.map((item) => {
            let richLabel

            const match = Object.entries(item._highlightResult).find(
              ([, result]) => result.matchLevel !== 'none'
            )

            if (match) {
              if (match[0] === 'label') {
                richLabel = <span dangerouslySetInnerHTML={{ __html: match[1].value }} />
              } else {
                richLabel = (
                  <span>
                    { item.label }

                    <span className='control-select__option--highlight-reason' style={{ float: 'right' }}>
                      <span className='label' style={{ marginRight: '1rem', backgroundColor: '#e0e0e0', color: 'inherit' }}>
                        { humaniseSnakeCase(match[0]) }
                      </span>

                      <span dangerouslySetInnerHTML={{ __html: match[1].value }} />
                    </span>
                  </span>
                )
              }
            }

            return {
              value: item.value,
              label: item.label,
              url: item.url,
              richLabel: (
                <>
                  <span className='label' style={{ backgroundColor: '#eee', color: 'inherit', marginRight: '1rem' }}>
                    {humaniseSnakeCase(item.field)}
                  </span>
                  {richLabel}
                </>
              ),
            }
          }))
        }

        this.setState({ options })
        resolve()
      })
    })
  }

  routeOption = ({ q }) => {
    const item = this.state.options.find(({ value }) => value === q)

    if (item && item.url) {
      location.href = item.url
    } else {
      console.error('No URL available.')
    }
  }

  render () {
    return (
      <Select
        extraGroupClasses={this.props.extraGroupClasses}
        minCharSearch={this.props.minchars}
        name='q'
        placeholder={this.props.placeholder}
        prefix={<span className='fa fa-search' />}
        searchOptions={this.searchOptions}
        suffix={this.state.searching && <span className='fa fa-pulse fa-spinner' />}
        options={this.state.options}
        updateValue={this.routeOption}
      />
    )
  }
}
