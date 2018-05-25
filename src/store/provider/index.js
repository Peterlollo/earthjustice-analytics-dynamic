import {
  FETCHING_PROVIDER_DATA,
  GET_PROVIDER_DATA_SUCCESS,
  GET_PROVIDER_DATA_FAILURE
} from './types'

const state = {
  error: false,
  fetchingData: false,
  providers: []
}

const mutations = {

  [FETCHING_PROVIDER_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_PROVIDER_DATA_SUCCESS] (state, providers) {
    state.providers = providers
    state.error = false
    state.fetchingData = false
  },

  [GET_PROVIDER_DATA_FAILURE] (state, providers) {
    state.error = true
    state.fetchingData = false
  }

}

export default { state, mutations }
