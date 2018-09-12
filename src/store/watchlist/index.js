import {
  FETCHING_WATCHLIST_DATA,
  GET_WATCHLIST_DATA_SUCCESS,
  GET_WATCHLIST_DATA_FAILURE,
  ADD_PROVIDER_TO_WATCHLIST_SUCCESS,
  ADD_PROVIDER_TO_WATCHLIST_FAILURE,
  REMOVE_PROVIDER_FROM_WATCHLIST_SUCCESS,
  REMOVE_PROVIDER_FROM_WATCHLIST_FAILURE,
  SET_PROVIDER_TO_ADD
} from './types'

const state = {
  error: false,
  fetchingData: false,
  watchlist: [],
  providerToAdd: ''
}

const mutations = {

  [FETCHING_WATCHLIST_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_WATCHLIST_DATA_SUCCESS] (state, {watchlist}) {
    state.watchlist = watchlist
    state.error = false
    state.fetchingData = false
  },

  [GET_WATCHLIST_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [ADD_PROVIDER_TO_WATCHLIST_SUCCESS] (state, {watchlist}) {
    state.watchlist = watchlist
  },

  [ADD_PROVIDER_TO_WATCHLIST_FAILURE] (state, provider) {
  },

  [REMOVE_PROVIDER_FROM_WATCHLIST_SUCCESS] (state, {watchlist}) {
    state.watchlist = watchlist
  },

  [REMOVE_PROVIDER_FROM_WATCHLIST_FAILURE] (state, provider) {
  },

  [SET_PROVIDER_TO_ADD] (state, provider) {
    state.providerToAdd = provider
  }

}

export default { state, mutations }
