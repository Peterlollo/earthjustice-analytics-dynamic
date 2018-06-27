import {
  FETCHING_PROVIDER_DATA,
  GET_PROVIDER_DATA_SUCCESS,
  GET_PROVIDER_DATA_FAILURE,
  GET_PROVIDER_DATA_COMPLETE
} from './types'

const state = {
  error: false,
  fetchingData: false,
  providers: [],
  pollingProviders: false
}

const mutations = {

  [FETCHING_PROVIDER_DATA] (state, bool) {
    state.fetchingData = bool
    state.pollingProviders = bool
  },

  [GET_PROVIDER_DATA_SUCCESS] (state, providers) {
    state.providers = providers
    state.error = false
    state.fetchingData = false
  },

  [GET_PROVIDER_DATA_FAILURE] (state, providers) {
    state.error = true
    state.fetchingData = false
    state.pollingProviders = false
  },

  [GET_PROVIDER_DATA_COMPLETE] (state) {
    state.pollingProviders = false
  }

}

export default { state, mutations }
