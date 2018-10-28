import {
  FETCHING_WATCHLIST_DATA,
  GET_WATCHLIST_DATA_SUCCESS,
  GET_WATCHLIST_DATA_FAILURE,
  ADD_PROVIDER_TO_WATCHLIST_SUCCESS,
  ADD_PROVIDER_TO_WATCHLIST_FAILURE,
  REMOVE_PROVIDER_FROM_WATCHLIST_SUCCESS,
  REMOVE_PROVIDER_FROM_WATCHLIST_FAILURE,
  SET_WATCHLIST_PROVIDER_TO_ADD_OR_REMOVE
} from './types'

const state = {
  error: false,
  fetchingData: false,
  watchlist: [],
  providerToAddOrRemove: ''
}

const formatWatchlist = (list) => {
  return list.map((el) => {
    return el.provider
  })
}

const mutations = {

  [FETCHING_WATCHLIST_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_WATCHLIST_DATA_SUCCESS] (state, watchlist) {
    state.watchlist = formatWatchlist(watchlist)
    state.error = false
    state.fetchingData = false
  },

  [GET_WATCHLIST_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [ADD_PROVIDER_TO_WATCHLIST_SUCCESS] (state, watchlist) {
    state.watchlist = formatWatchlist(watchlist)
    state.providerToAddOrRemove = ''
  },

  [ADD_PROVIDER_TO_WATCHLIST_FAILURE] (state, provider) {
    state.providerToAddOrRemove = ''
  },

  [REMOVE_PROVIDER_FROM_WATCHLIST_SUCCESS] (state, watchlist) {
    state.watchlist = formatWatchlist(watchlist)
    state.providerToAddOrRemove = ''
  },

  [REMOVE_PROVIDER_FROM_WATCHLIST_FAILURE] (state, provider) {
    state.providerToAddOrRemove = ''
  },

  [SET_WATCHLIST_PROVIDER_TO_ADD_OR_REMOVE] (state, provider) {
    state.providerToAddOrRemove = provider
  }

}

export default { state, mutations }
