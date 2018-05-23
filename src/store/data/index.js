import {
  FETCHING_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_FAILURE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  WHITELIST_PROVIDER_FAILURE,
  WHITELIST_PROVIDER_SUCCESS,
  WHITELIST_CHANGE_PROVIDER_SECTOR_SUCCESS,
  WHITELIST_CHANGE_PROVIDER_SECTOR_FAILURE,
  GET_PROVIDERS_DATA_SUCCESS,
  GET_PROVIDERS_DATA_FAILURE
} from './types'

import { whitelist, whitelistSectors } from './whitelist'

const state = {
  error: false,
  fetchingData: false,
  path: '',
  providers: [],
  providerSessions: {
    // 'united states senate': [5, 247, 3], 'amazon': [33]
  },
  pathFromParam: '',
  pathFromParamStatus: null,
  pathFoundInStore: false,
  whitelist: whitelist,
  whitelistSectors: whitelistSectors
}

const mutations = {

  [FETCHING_DATA] (state, boolean) {
    state.fetchingData = boolean
  },

  [GET_DATA_SUCCESS] (state, { providers, path, providerSessions }) {
    state.error = false
    state.providers = providers
    state.path = path
    state.providerSessions = providerSessions
    state.fetchingData = false
  },

  [GET_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [GET_PROVIDERS_DATA_SUCCESS] (state, providers) {
    state.error = false
    state.providers = providers
    state.fetchingData = false
  },

  [GET_PROVIDERS_DATA_FAILURE] (state, providers) {
    state.error = true
    state.fetchingData = false
  },

  [GET_PATH_FROM_PARAM_SUCCESS] (state, path) {
    state.pathFromParam = path
    state.pathFromParamStatus = 'success'
    let pathWithSlash = `${path}/`
    state.pathFoundInStore = ((state.path === path) || (state.path === pathWithSlash))
  },

  [GET_PATH_FROM_PARAM_FAILURE] (state, path) {
    state.pathFromParam = path
    state.pathFromParamStatus = 'fail'
  },

  [WHITELIST_PROVIDER_FAILURE] (state) {
  },

  [WHITELIST_PROVIDER_SUCCESS] (state, provider) {
    state.providers = state.providers.map((p) => {
      return p.id === provider.id ? provider : p
    })
  },

  [WHITELIST_CHANGE_PROVIDER_SECTOR_SUCCESS] (state, provider) {
    state.providers = state.providers.map((p) => {
      return p.id === provider.id ? provider : p
    })
  },

  [WHITELIST_CHANGE_PROVIDER_SECTOR_FAILURE] (state) {
  }

}

export default { state, mutations }
