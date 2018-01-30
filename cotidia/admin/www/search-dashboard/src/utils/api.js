import URLSearchParams from 'url-search-params'

async function _fetch (method, url, data = {}, headers = {}) {
  const fetchConfig = {
    headers: {
      'Accept': 'application/json',
      ...headers,
    },
    method,
  }

  if (data) {
    if (headers['Content-Type'] === 'application/json') {
      fetchConfig.body = JSON.stringify(data)
    } else {
      const formData = new FormData()
      let hasData = false

      for (const [key, value] of Object.entries(data)) {
        // Non-strict equality on purpose for weeding out null or undefined but keeping everything else.
        if (value != null) {
          if (Array.isArray(value)) {
            value.forEach((value) => formData.append(key, value))
          } else {
            formData.append(key, value)
          }

          hasData = true
        }
      }

      if (hasData) {
        fetchConfig.body = formData
      }
    }
  }

  const response = await fetch(url, fetchConfig)

  let responseData

  try {
    responseData = await response.json()
  } catch (e) {
    // pass
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    data: responseData,
  }
}

export { _fetch as fetch }

export async function fetchAuthenticated (method, url, data = {}, headers = {}) {
  const token = sessionStorage.getItem('authToken')

  return _fetch(method, url, data, {
    ...headers,
    'Authorization': `Token ${token}`,
  })
}

export function generateURL (url, data) {
  if (data) {
    for (const key of Object.keys(data)) {
      if (key === '?') {
        const search = new URLSearchParams()

        for (const [queryKey, queryValue] of Object.entries(data[key])) {
          if (queryValue != null) {
            if (Array.isArray(queryValue)) {
              queryValue.forEach((value) => search.append(queryKey, value))
            } else {
              search.set(queryKey, queryValue)
            }
          }
        }

        const searchString = search.toString()

        if (searchString.length) {
          if (url.includes('?')) {
            url += `&${searchString}`
          } else {
            url += `?${searchString}`
          }
        }
      } else {
        url = url.replace(new RegExp(`:${key}`, 'g'), data[key])
      }
    }
  }

  return url
}
