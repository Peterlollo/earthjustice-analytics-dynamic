import {
  FETCHING_WHITELIST_DATA,
  GET_WHITELIST_DATA_SUCCESS,
  GET_WHITELIST_DATA_FAILURE,
  ADD_PROVIDER_TO_WHITELIST_SUCCESS,
  ADD_PROVIDER_TO_WHITELIST_FAILURE,
  REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS,
  REMOVE_PROVIDER_FROM_WHITELIST_FAILURE
} from './types'

// import { whitelist, whitelistSectors } from './whitelist'

const state = {
  error: false,
  fetchingData: false,
  whitelist: {},
  whitelistSectors: []
}

const mutations = {

  [FETCHING_WHITELIST_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_WHITELIST_DATA_SUCCESS] (state, {whitelist, whitelistSectors}) {
    state.whitelist = whitelist
    state.whitelistSectors = whitelistSectors
    state.error = false
    state.fetchingData = false
  },

  [GET_WHITELIST_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [ADD_PROVIDER_TO_WHITELIST_SUCCESS] (state, {whitelist, whitelistSectors}) {
    state.whitelist = whitelist
    state.whitelistSectors = whitelistSectors
  },

  [ADD_PROVIDER_TO_WHITELIST_FAILURE] (state, provider) {
  },

  [REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS] (state, {whitelist, whitelistSectors}) {
    state.whitelist = whitelist
    state.whitelistSectors = whitelistSectors
  },

  [REMOVE_PROVIDER_FROM_WHITELIST_FAILURE] (state, provider) {
  }

}

export default { state, mutations }
