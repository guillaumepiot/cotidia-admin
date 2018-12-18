import React from 'react'
import algoliasearch from 'algoliasearch/lite'

import {
  hash,
  humaniseSnakeCase,
  identity,
} from './'

const api = (endpoint) => async (q) => {
  const url = new URL(endpoint, window.location.href)

  url.searchParams.set('q', q)

  const response = await fetch(url)

  if (response.ok) {
    return response.json()
  }

  throw new Error('Error in fetch', `Status: ${response.status}`, `Text: ${await response.text()}`)
}

const algolia = ({ appId, apiKey, indexes, filters }) => {
  let algolia

  if (appId && apiKey && indexes) {
    algolia = algoliasearch(appId, apiKey)
  } else {
    console.warn('Algolia details not provided. This is not going to end well...')
  }

  return async (q) => new Promise((resolve, reject) => {
    if (! algolia) {
      return reject(new Error('Algolia not set up right.'))
    }

    const queries = indexes.map((index) => ({
      indexName: index,
      query: q,
      params: {
        filters: filters?.join(' OR '),
      },
    }))

    algolia.search(queries, (err, content) => {
      if (err) {
        reject(err)
      }

      // Concatenate all indices' hits into one big array.
      const data = content.results.reduce((agg, { hits }) => agg.concat(hits), [])

      resolve(data)
    })
  })
}

const options = ({ options }) => async (q) =>
  options.filter((item) => item.label.toString().toLowerCase().includes(q.toString().toLowerCase()))

const augmentSuggestionFactory = (filterConfiguration, genericFilters) => (item) => {
  // Hack because an old version of the Python Algolia implementation indexed using `field`
  // instead of `filter`, and we couldn't be bothered to reindex it and fix everything else that
  // relied on this. But please use `filter`!
  item.filter = item.filter || item.field

  if (item.filter && ! filterConfiguration.hasOwnProperty(item.filter)) {
    return
  }

  let richLabel

  let matchField
  let matchValue

  if (item._highlightResult) {
    for (const [field, result] of Object.entries(item._highlightResult)) {
      if (Array.isArray(result)) {
        const innerMatch = result.find((result) => result.matchLevel !== 'none')

        if (innerMatch) {
          matchField = field
          matchValue = innerMatch.value
          break
        }
      } else {
        if (result.matchLevel !== 'none') {
          matchField = field
          matchValue = result.value
          break
        }
      }
    }
  }

  if (matchField && matchValue) {
    if (matchField === 'label') {
      richLabel = <span dangerouslySetInnerHTML={{ __html: matchValue }} />
    } else {
      richLabel = (
        <>
          { item.label }

          <span className='control-select-option__meta'>
            <span className='label control-select-option__label'>
              { humaniseSnakeCase(matchField) }
            </span>

            <span dangerouslySetInnerHTML={{ __html: matchValue }} />
          </span>
        </>
      )
    }
  }

  if (genericFilters) {
    richLabel = (
      <>
        <span className={`label control-select-option__label control-select-option__label--${hash(item.filter)}`}>
          { filterConfiguration[item.filter].label }
        </span>
        { richLabel }
      </>
    )
  }

  const ret = {
    value: item.value,
    label: item.label,
    richLabel,
  }

  if (genericFilters) {
    ret.filter = item.filter
    ret.value = `${item.filter}:${item.value}`
  }

  return ret
}

export const getSuggestEngine = (config = {}, filterConfig = {}, genericFilters = false) => {
  let func

  if (config.mode === 'api') {
    func = api(config.endpoint)
  } else if (config.mode === 'algolia') {
    func = algolia(config.algoliaConfig || {})
  } else if (config.mode === 'options') {
    func = options(config)
  }

  const augmentationEngine = augmentSuggestionFactory(filterConfig, genericFilters)

  return async (q) => {
    if (func) {
      const res = await func(q)
      return (res).map(augmentationEngine).filter(identity)
    }

    return []
  }
}
