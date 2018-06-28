import { handleDynamicListMessage } from '../redux/modules/search/actions'

export const curry = (func, ...outerArgs) => (...innerArgs) => func(...outerArgs, ...innerArgs)

export const messageHandlerFactory = (store) => (event) => {
  if (event.data && (event.data.target === 'DynamicList')) {
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
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid4)
}
/* eslint-enable */

export const makePromiseCancellable = (promise) => {
  let isCancelled = false

  const newPromise = new Promise(
    (resolve, reject) => promise.then(
      (r) => isCancelled ? reject({ isCanceled: true }) : resolve(r)
    )
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
