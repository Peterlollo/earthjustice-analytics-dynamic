import {
  FETCHING_REPORT_DATA,
  FETCHING_PROVIDER_SESSION_DATA,
  GET_REPORT_DATA_SUCCESS,
  GET_REPORT_DATA_FAILURE,
  GET_REPORT_DATA_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO,
  VIEW_PROVIDER_PAGES,
  GET_REPORT_DATA_SUCCESS_WITH_PATH_FILTER
} from './types'

import { getPath } from './actions.js'

const state = {
  error: false,
  fetchingData: false,
  fetchingProviderSessionData: false,
  path: '',
  providers: [],
  providerSessions: {
    // 'united states senate': {
    // // timesOnPage: [5, 247, 3],
    // // paths: ['earthjustice.org', 'earthjustice.org/about']
    // }
  },
  pathFromParam: '',
  pathFromParamStatus: null,
  pathFoundInStore: false,
  polling: false,
  googleAnalyticsDaysAgo: 2,
  viewingProviderPagesFor: '',
  providersWithPathFilter: [],
  providerSessionsWithPathFilter: {}
}

const mutations = {

  [FETCHING_REPORT_DATA] (state, bool) {
    state.fetchingData = bool
    state.polling = bool
  },

  [FETCHING_PROVIDER_SESSION_DATA] (state, bool) {
    state.fetchingProviderSessionData = bool
    state.polling = bool
  },

  [GET_REPORT_DATA_SUCCESS] (state, { providers, path, providerSessions }) {
    state.providers = providers
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
  },

  [VIEW_PROVIDER_PAGES] (state, provider) {
    state.viewingProviderPagesFor = provider
  },

  [GET_REPORT_DATA_SUCCESS_WITH_PATH_FILTER] (state, { providers, path, providerSessions }) {
    let urlPath = getPath()
    if (urlPath === path || `${urlPath}/` === path) { // sometimes GA returns a different earthjustice path that is not what we're searching for
      state.path = path
    }
    state.providersWithPathFilter = providers
    state.providerSessionsWithPathFilter = providerSessions
    state.error = false
    state.fetchingData = false
  }

}

export default { state, mutations }
