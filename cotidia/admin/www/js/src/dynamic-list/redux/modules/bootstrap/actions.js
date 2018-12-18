import * as types from './types'

export const bootstrap = (payload) => ({
  type: types.BOOTSTRAP,
  payload,
})
