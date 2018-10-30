import algoliasearch from 'algoliasearch/lite'

export const api = ({ endpoint }) => async (q) => {
  const url = new URL(endpoint, window.location.href)

  url.searchParams.set('q', q)

  const response = await fetch(url)

  if (response.ok) {
    return response.json()
  }

  throw new Error(`Error in fetch, status: ${response.status}`)
}

export const algolia = ({ algoliaConfig: { appId, apiKey, indexes, filters } = {} }) => {
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
