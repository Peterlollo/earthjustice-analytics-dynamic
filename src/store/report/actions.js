import {
  FETCHING_PROVIDER_SESSION_DATA,
  GET_REPORT_DATA_SUCCESS,
  GET_REPORT_DATA_FAILURE,
  GET_REPORT_DATA_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO,
  VIEW_PROVIDER_PAGES
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
  let path = getPath()
  let daysAgo = state.report.googleAnalyticsDaysAgo
  axios.get(`${process.env.API_BASE_URL}/api/reports/data`, {params: {path, daysAgo}})
    .then(response => {
      setTimeout(function () { pollReportData(commit, dispatch, state) }, 2000)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_FAILURE, e)
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
        commit(commitMsg, response.data.rows)
        dispatch('getPathFromParam')
        setTimeout(function () { pollReportData(commit, dispatch, state) }, 2000)
      } else { // all report data collected from GA
        let commitMsg = GET_REPORT_DATA_SUCCESS
        commit(commitMsg, response.data.rows)
        commit(GET_REPORT_DATA_COMPLETE)
        dispatch('getPathFromParam')
      }
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_FAILURE, e)
    })
}
