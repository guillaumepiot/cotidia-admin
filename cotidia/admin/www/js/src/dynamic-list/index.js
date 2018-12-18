import React from 'react'

import { Provider } from 'react-redux'
import configureStore from './redux/create'
import { bootstrap } from './redux/modules/bootstrap/actions'

import { messageHandlerFactory } from './utils'
import { dynamicListPropTypes } from './utils/propTypes'

import DynamicList from './containers/DynamicList'

import { FullScreen } from './components/elements/global'

export default function DynamicListApp (props) {
  const { authToken, ...config } = props

  if (! authToken) {
    return (
      <FullScreen>
        Dynamic list configuration not provided.
      </FullScreen>
    )
  }

  sessionStorage.setItem('authToken', authToken)

  const { store } = configureStore()

  store.dispatch(bootstrap(config))

  window.addEventListener('message', messageHandlerFactory(store))

  return (
    <Provider store={store}>
      <DynamicList />
    </Provider>
  )
}

DynamicListApp.propTypes = dynamicListPropTypes

// TODO: check whether this is up to date
DynamicListApp.defaultProps = {
  allowedResultsModes: ['table'],
  batchActions: [],
  defaultColumns: [],
  defaultFilters: {},
  defaultOrderBy: null,
  defaultResultsMode: 'table',
  ignoreStoredConfig: false,
}
