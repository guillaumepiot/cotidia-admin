import { handleSearchDashboardMessage } from '../redux/modules/search/actions'

export const curry = (func, ...outerArgs) => (...innerArgs) => func(...outerArgs, ...innerArgs)

export const messageHandlerFactory = (store) => (event) => {
  if (event.data && (event.data.target === 'SearchDashboard')) {
    store.dispatch(handleSearchDashboardMessage(event.data))
  }
}

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
