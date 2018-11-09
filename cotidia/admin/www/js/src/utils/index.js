import moment from 'moment'
import { handleDynamicListMessage } from '../redux/modules/search/actions'

export const curry = (func, ...outerArgs) => (...innerArgs) => func(...outerArgs, ...innerArgs)

export const messageHandlerFactory = (store) => (event) => {
  if (event.data?.target === 'DynamicList') {
    store.dispatch(handleDynamicListMessage(event.data))
  }
}

/* eslint-disable */
/**
 * Generate a UUIDv4.
 *
 * @see https://gist.github.com/LeverOne/1308368
 */
export function uuid4(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid4)
}
/* eslint-enable */

/**
 * Get a hash of a given string (between 0-15).
 *
 * @param {String} str The string to hash.
 */
export function hash (str) {
  /* eslint-disable */
  let hash = 5381
  let i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  // `and` with 0xf to convert to 0-15
  return hash & 0xf
  /* eslint-enable */
}

export function humaniseSnakeCase (snaked) {
  snaked = snaked.replace(/_./g, function (match) {
    return ` ${match[1].toUpperCase()}`
  })

  snaked = snaked[0].toUpperCase() + snaked.slice(1)

  return snaked
}

export const identity = (x) => x

class PromiseCancelledError extends Error {}

export const makePromiseCancellable = (promise) => {
  let isCancelled = false

  const newPromise = new Promise((resolve, reject) =>
    promise.then((r) => (isCancelled ? reject(PromiseCancelledError) : resolve(r)))
  )

  newPromise.cancel = () => {
    isCancelled = true
  }

  return newPromise
}

export const debounce = (ms, func) => {
  let timeout

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(func, ms, ...args)
  }
}

export function getFilterLabel (filter, filterName, value, config) {
  switch (filter.filter) {
    case 'boolean':
      return null

    case 'choice':
    case 'choice-single':
      if (filter.configuration.mode === 'options') {
        return filter?.configuration?.options?.find(
          (option) => option.value === value
        )?.label
      } else {
        // Get label from local storage cache.
        // TODO: prefix cache with endpoint
        return localStorage.getItem(`${filterName}:${value}`) || ''
      }

    case 'date': {
      const min = value.min && moment(value.min).format(config.dateFormat)
      const max = value.max && moment(value.max).format(config.dateFormat)
      return `${min}–${max}`
    }

    case 'number':
      return `${value.min}–${value.max}`

    case 'text':
      return value
  }

  return ''
}

export function cacheFilterLabel (filter, value, label) {
  // TODO: prefix cache with endpoint
  localStorage.setItem(`${filter}:${value}`, label)
}
