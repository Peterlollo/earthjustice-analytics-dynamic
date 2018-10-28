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
  whitelistSectors: [
    'Federal Government',
    'State Government Agencies',
    'State Governments',
    'Local Governments',
    'International Government',
    'Legal',
    'Nonprofits',
    'Foundations',
    'Media',
    'Aerospace and Transportation',
    'Energy',
    'Financial Services',
    'Insurance',
    'Pharma and Biotech and Chemicals',
    'Technology',
    'Consumer Goods and Services',
    'Medical Institutions',
    'Universities and Colleges',
    'K-12 Schools'
  ],
  providerToAdd: '',
  showWhitelistedProviders: false,
  showUnlistedProviders: false
}

const formatWhitelist = (list) => {
  const newWhitelist = {}
  list.forEach((el) => {
    newWhitelist[el.provider] = {sector: el.sector}
  })
  return newWhitelist
}

const mutations = {

  [FETCHING_WHITELIST_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_WHITELIST_DATA_SUCCESS] (state, whitelist) {
    state.whitelist = formatWhitelist(whitelist)
    state.error = false
    state.fetchingData = false
  },

  [GET_WHITELIST_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [ADD_PROVIDER_TO_WHITELIST_SUCCESS] (state, whitelist) {
    state.whitelist = formatWhitelist(whitelist)
  },

  [ADD_PROVIDER_TO_WHITELIST_FAILURE] (state, provider) {
  },

  [REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS] (state, whitelist) {
    state.whitelist = formatWhitelist(whitelist)
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
