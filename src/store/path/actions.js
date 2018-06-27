import {
  FETCHING_PATH_DATA,
  GET_PATH_DATA_SUCCESS,
  GET_PATH_DATA_FAILURE,
  GET_PATH_DATA_COMPLETE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  SET_DAYS_AGO
} from './types'
import axios from 'axios'

const getPath = () => {
  let parsedUrl = new URL(window.location.href)
  return parsedUrl.searchParams.get('path')
}

export const getPathData = ({commit, state, dispatch}) => {
  commit(FETCHING_PATH_DATA, true)
  let path = getPath()
  let daysAgo = state.path.googleAnalyticsDaysAgo
  axios.get(`${process.env.API_BASE_URL}/api/paths/data`, {params: {path, daysAgo}})
    .then(response => {
      // initial response will likely not contain all data
      // data can take a while to collect from GA, so we'll poll for it
      setTimeout(function () { pollPaths(commit, dispatch) }, 2000)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PATH_DATA_FAILURE, e)
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

const pollPaths = (commit, dispatch) => {
  axios.get(`${process.env.API_BASE_URL}/api/paths/pollData`)
    .then(response => {
      if (response.data.pageToken) { // still collecting provider data from GA
        commit(GET_PATH_DATA_SUCCESS, response.data.reportData)
        dispatch('getPathFromParam')
        setTimeout(function () { pollPaths(commit, dispatch) }, 2000)
      } else { // all provider data collected from GA
        commit(GET_PATH_DATA_SUCCESS, response.data.reportData)
        commit(GET_PATH_DATA_COMPLETE)
        dispatch('getPathFromParam')
      }
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PATH_DATA_FAILURE, e)
    })
}

export const setDaysAgo = ({commit}, daysAgo) => {
  commit(SET_DAYS_AGO, daysAgo)
}
