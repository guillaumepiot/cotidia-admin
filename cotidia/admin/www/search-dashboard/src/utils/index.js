import { handleSearchDashboardMessage } from '../redux/modules/search/actions'

export const curry = (func, ...outerArgs) => (...innerArgs) => func(...outerArgs, ...innerArgs)

export const messageHandlerFactory = (store) => (event) => {
  if (event.data && (event.data.target === 'SearchDashboard')) {
    store.dispatch(handleSearchDashboardMessage(event.data))
  }
}
