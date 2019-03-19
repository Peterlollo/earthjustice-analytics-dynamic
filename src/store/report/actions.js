import {
  FETCHING_REPORT_DATA,
  FETCHING_PROVIDER_SESSION_DATA,
  GET_REPORT_DATA_SUCCESS,
  GET_REPORT_DATA_FAILURE,
  GET_REPORT_DATA_WITH_FILTER_FAILURE,
  GET_REPORT_DATA_COMPLETE,
  GET_REPORT_DATA_WITH_FILTER_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO,
  VIEW_PROVIDER_PAGES,
  GET_REPORT_DATA_SUCCESS_WITH_PATH_FILTER
} from './types'
import axios from 'axios'
import Router from '../../router'

export const setDaysAgo = ({commit}, daysAgo) => {
  commit(SET_DAYS_AGO, daysAgo)
}

export const viewProviderPages = ({commit}, provider) => {
  Router.push('/providersessions')
  commit(VIEW_PROVIDER_PAGES, provider)
}

export const getPath = () => {
  let parsedUrl = new URL(window.location.href)
  return parsedUrl.searchParams.get('path')
}

export const getReportData = ({commit, state, dispatch}) => {
  commit(FETCHING_PROVIDER_SESSION_DATA, true)
  let path = null
  let daysAgo = state.report.googleAnalyticsDaysAgo
  axios.get(`${process.env.API_BASE_URL}/api/reports/data`, {params: {path, daysAgo}})
    .then(response => {
      // initial response will likely not contain all data
      // data can take a while to collect from GA, so we'll poll for it
      setTimeout(function () { pollReportData(commit, dispatch, state) }, 2000)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_FAILURE, e)
    })
}

export const getReportDataWithFilter = ({commit, state, dispatch}) => {
  commit(FETCHING_REPORT_DATA, true)
  let path = getPath()
  console.log('path in getReportData ', path)
  let daysAgo = state.report.googleAnalyticsDaysAgo
  axios.get(`${process.env.API_BASE_URL}/api/reports/data-with-filter`, {params: {path, daysAgo}})
    .then(response => {
      // initial response will likely not contain all data
      // data can take a while to collect from GA, so we'll poll for it
      setTimeout(function () { pollReportDataWithFilter(commit, dispatch, state) }, 2000)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_WITH_FILTER_FAILURE, e)
    })
}

export const getPathFromParam = ({commit, dispatch}) => {
  let path = getPath()
  if (path) {
    commit(GET_PATH_FROM_PARAM_SUCCESS, path)
  } else {
    commit(GET_PATH_FROM_PARAM_FAILURE, path)
  }
}

const pollReportData = (commit, dispatch, state) => {
  axios.get(`${process.env.API_BASE_URL}/api/reports/pollData`)
    .then(response => {
      if (response.data.pageToken) { // still collecting report data from GA
        let commitMsg = GET_REPORT_DATA_SUCCESS
        commit(commitMsg, response.data.reportData)
        setTimeout(function () { pollReportData(commit, dispatch, state) }, 2000)
      } else { // all report data collected from GA
        let commitMsg = GET_REPORT_DATA_SUCCESS
        commit(commitMsg, response.data.reportData)
        commit(GET_REPORT_DATA_COMPLETE)
      }
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_FAILURE, e)
    })
}

const pollReportDataWithFilter = (commit, dispatch, state) => {
  axios.get(`${process.env.API_BASE_URL}/api/reports/pollData-with-filter`)
    .then(response => {
      if (response.data.pageToken) { // still collecting report data from GA
        let commitMsg = GET_REPORT_DATA_SUCCESS_WITH_PATH_FILTER
        commit(commitMsg, response.data.reportData)
        dispatch('getPathFromParam')
        setTimeout(function () { pollReportDataWithFilter(commit, dispatch, state) }, 2000)
      } else { // all report data collected from GA
        let commitMsg = GET_REPORT_DATA_SUCCESS_WITH_PATH_FILTER
        commit(commitMsg, response.data.reportData)
        commit(GET_REPORT_DATA_WITH_FILTER_COMPLETE)
        dispatch('getPathFromParam')
        // the initial data request came from the 'Paths.vue' component so
        // we want to fetch more data that is not filtered by path, in case
        // the user clicks on a provider to see what other pages that provider has visited
        getReportData({commit, state, dispatch})
      }
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_WITH_FILTER_FAILURE, e)
    })
}
