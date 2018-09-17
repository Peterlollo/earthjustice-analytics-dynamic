import {
  FETCHING_WHITELIST_DATA,
  GET_WHITELIST_DATA_SUCCESS,
  GET_WHITELIST_DATA_FAILURE,
  ADD_PROVIDER_TO_WHITELIST_SUCCESS,
  ADD_PROVIDER_TO_WHITELIST_FAILURE,
  REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS,
  REMOVE_PROVIDER_FROM_WHITELIST_FAILURE,
  SET_PROVIDER_TO_ADD,
  TOGGLE_PROVIDERS_LISTS
} from './types'

const state = {
  error: false,
  fetchingData: false,
  whitelist: {},
  whitelistSectors: [],
  providerToAdd: '',
  showWhitelistedProviders: false,
  showUnlistedProviders: false
}

const mutations = {

  [FETCHING_WHITELIST_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_WHITELIST_DATA_SUCCESS] (state, {whitelist, whitelistSectors}) {
    state.whitelist = whitelist
    state.whitelistSectors = whitelistSectors.sectors
    state.error = false
    state.fetchingData = false
  },

  [GET_WHITELIST_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [ADD_PROVIDER_TO_WHITELIST_SUCCESS] (state, {whitelist, whitelistSectors}) {
    state.whitelist = whitelist
    state.whitelistSectors = whitelistSectors.sectors
  },

  [ADD_PROVIDER_TO_WHITELIST_FAILURE] (state, provider) {
  },

  [REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS] (state, {whitelist, whitelistSectors}) {
    state.whitelist = whitelist
    state.whitelistSectors = whitelistSectors.sectors
  },

  [REMOVE_PROVIDER_FROM_WHITELIST_FAILURE] (state, provider) {
  },

  [SET_PROVIDER_TO_ADD] (state, provider) {
    state.providerToAdd = provider
  },

  [TOGGLE_PROVIDERS_LISTS] (state, list) {
    if (list === 'whitelist') {
      state.showWhitelistedProviders = !state.showWhitelistedProviders
    } else if (list === 'unlisted') {
      state.showUnlistedProviders = !state.showUnlistedProviders
    }
  }

}

export default { state, mutations }
