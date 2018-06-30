import {
  FETCHING_REPORT_DATA,
  GET_REPORT_DATA_SUCCESS,
  GET_REPORT_DATA_FAILURE,
  GET_REPORT_DATA_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO
} from './types'
import axios from 'axios'

export const setDaysAgo = ({commit}, daysAgo) => {
  commit(SET_DAYS_AGO, daysAgo)
}

const getPath = () => {
  let parsedUrl = new URL(window.location.href)
  return parsedUrl.searchParams.get('path')
}

export const getReportData = ({commit, state, dispatch}) => {
  commit(FETCHING_REPORT_DATA, true)
  let path = getPath()
  let daysAgo = state.report.googleAnalyticsDaysAgo
  axios.get(`${process.env.API_BASE_URL}/api/reports/data`, {params: {path, daysAgo}})
    .then(response => {
      // initial response will likely not contain all data
      // data can take a while to collect from GA, so we'll poll for it
      setTimeout(function () { pollReportData(commit, dispatch) }, 2000)
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

const pollReportData = (commit, dispatch) => {
  axios.get(`${process.env.API_BASE_URL}/api/reports/pollData`)
    .then(response => {
      if (response.data.pageToken) { // still collecting report data from GA
        commit(GET_REPORT_DATA_SUCCESS, response.data.reportData)
        dispatch('getPathFromParam')
        setTimeout(function () { pollReportData(commit, dispatch) }, 2000)
      } else { // all report data collected from GA
        commit(GET_REPORT_DATA_SUCCESS, response.data.reportData)
        commit(GET_REPORT_DATA_COMPLETE)
        dispatch('getPathFromParam')
      }
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_REPORT_DATA_FAILURE, e)
    })
}
