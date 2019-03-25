import {
  // FETCHING_REPORT_DATA,
  FETCHING_PROVIDER_SESSION_DATA,
  GET_REPORT_DATA_SUCCESS,
  GET_REPORT_DATA_FAILURE,
  GET_REPORT_DATA_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO,
  VIEW_PROVIDER_PAGES
} from './types'
import Vue from 'vue'

// import { getPath } from './actions.js'

const state = {
  error: false,
  fetchingData: false,
  fetchingProviderSessionData: false,
  report: {},
  providers: [],
  providerSessions: {
    // '<provider>': {
    // // '<path>': <total seconds on path>,
    // }
    // OLD:
    // 'united states senate': {
    // // timesOnPage: [5, 247, 3],
    // // paths: ['earthjustice.org', 'earthjustice.org/about']
    // }
  },
  pathFromParam: '',
  pathFromParamStatus: null,
  polling: false,
  googleAnalyticsDaysAgo: 2,
  viewingProviderPagesFor: ''
}

const mutations = {

  // [FETCHING_REPORT_DATA] (state, bool) {
  //   state.fetchingData = bool
  //   state.polling = bool
  // },

  [FETCHING_PROVIDER_SESSION_DATA] (state, bool) {
    state.fetchingProviderSessionData = bool
    state.polling = bool
  },

  [GET_REPORT_DATA_SUCCESS] (state, report) {
    console.log('report: ', report)
    state.report = report
    let data = report.data
    let rows = data ? data.rows : []
    let providersToAdd = []
    let providerSessionsToAdd = Object.assign({}, state.providerSessions)
    for (let i = 0; i < rows.length; i++) {
      const rowDimensions = rows[i].dimensions
      const provider = rowDimensions[0]
      const path = rowDimensions[1]
      const rowMetrics = rows[i].metrics[0].values
      const timeOnPage = Number(rowMetrics[0])
      // add providers
      if (state.providers.indexOf(provider) === -1) {
        providersToAdd.push(provider)
      }
      // add providerSessions
      providerSessionsToAdd[provider] = providerSessionsToAdd[provider] || {}
      providerSessionsToAdd[provider][path] = providerSessionsToAdd[provider][path] || 0
      providerSessionsToAdd[provider][path] += timeOnPage
    }
    Vue.set(state, 'providers', [...state.providers, ...providersToAdd])
    Vue.set(state, 'providerSessions', providerSessionsToAdd)
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
    state.fetchingProviderSessionData = false
  },

  [GET_PATH_FROM_PARAM_SUCCESS] (state, path) {
    state.pathFromParam = path
    state.pathFromParamStatus = 'success'
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
  }

  // [GET_REPORT_DATA_SUCCESS_WITH_PATH_FILTER] (state, { providers, path, providerSessions }) {
  //   let urlPath = getPath()
  //   // TODO: possible that the issue here is that "path" needs a trailing slash?
  //   if (urlPath === path || `${urlPath}/` === path) { // sometimes GA returns a different earthjustice path that is not what we're searching for
  //     state.path = path
  //     state.providersWithPathFilter = providers
  //     state.providerSessionsWithPathFilter = providerSessions
  //   }
  //   state.error = false
  //   state.fetchingData = false
  // }

}

export default { state, mutations }
