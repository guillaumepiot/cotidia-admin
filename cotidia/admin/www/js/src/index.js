import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import configureStore from './redux/create'
import { bootstrap } from './redux/modules/bootstrap/actions'

import { messageHandlerFactory } from './utils'
import { dynamicListPropTypes } from './utils/propTypes'

import DynamicList from './containers/DynamicList'

import { FullScreen } from './components/elements/global'

import TypeaheadSwitcher from './typeahead-switcher'
import MultipleSelectWidget from './multiple-select-widget'

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

DynamicListApp.defaultProps = {
  batchActions: [],
  defaultColumns: [],
  defaultFilters: {},
  defaultOrderBy: null,
  detailURL: null,
  ignoreStoredConfig: false,
}

window.React = React
window.ReactDOM = ReactDOM
window.DynamicList = DynamicListApp

window.TypeaheadSwitcher = TypeaheadSwitcher
window.MultipleSelectWidget = MultipleSelectWidget