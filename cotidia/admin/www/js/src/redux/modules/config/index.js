import * as types from './types'

const initialState = {
  columnsConfigurable: true,
  dateFormat: 'D MMM YYYY',
  datetimeFormat: 'D MMM YYYY @ HH:mm',
  detailConfig: null,
  filterTagBarVisible: false,
  ignoreStoredConfig: false,
  listHandling: {
    style: 'string',
    value: ', ',
  },
  primaryColor: '#00abd3',
  searchVisible: true,
}

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case types.SET_CONFIG:
      return {
        ...state,
        ...payload,
      }

    default:
      return state
  }
}
