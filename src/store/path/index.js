import {
  FETCHING_PATH_DATA,
  GET_PATH_DATA_SUCCESS,
  GET_PATH_DATA_FAILURE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE
} from './types'

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
  pathFoundInStore: false
}

const mutations = {

  [FETCHING_PATH_DATA] (state, bool) {
    state.fetchingData = bool
  },

  [GET_PATH_DATA_SUCCESS] (state, { providers, path, providerSessions }) {
    state.providers = providers
    state.path = path
    state.providerSessions = providerSessions
    state.error = false
    state.fetchingData = false
  },

  [GET_PATH_DATA_FAILURE] (state, error) {
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
  }

}

export default { state, mutations }