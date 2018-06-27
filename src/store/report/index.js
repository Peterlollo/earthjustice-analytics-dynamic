import {
  FETCHING_REPORT_DATA,
  GET_REPORT_DATA_SUCCESS,
  GET_REPORT_DATA_FAILURE,
  GET_REPORT_DATA_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO
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
  pathFoundInStore: false,
  polling: false,
  googleAnalyticsDaysAgo: 2
}

const mutations = {

  [FETCHING_REPORT_DATA] (state, bool) {
    state.fetchingData = bool
    state.polling = bool
  },

  [GET_REPORT_DATA_SUCCESS] (state, { providers, path, providerSessions }) {
    state.providers = providers
    state.path = path
    state.providerSessions = providerSessions
    state.error = false
    state.fetchingData = false
  },

  [GET_REPORT_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
    state.polling = false
  },

  [GET_REPORT_DATA_COMPLETE] (state, error) {
    state.polling = false
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

  [SET_DAYS_AGO] (state, daysAgo) {
    state.googleAnalyticsDaysAgo = daysAgo
  }

}

export default { state, mutations }