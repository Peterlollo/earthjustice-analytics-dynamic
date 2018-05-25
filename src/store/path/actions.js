import {
  FETCHING_PATH_DATA,
  GET_PATH_DATA_SUCCESS,
  GET_PATH_DATA_FAILURE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE
} from './types'
import axios from 'axios'

const getPath = () => {
  let parsedUrl = new URL(window.location.href)
  return parsedUrl.searchParams.get('path')
}

export const getPathData = ({commit, dispatch}) => {
  commit(FETCHING_PATH_DATA, true)
  let path = getPath()
  axios.get(`${process.env.API_BASE_URL}/api/paths/data`, {params: {path}})
    .then(response => {
      console.log('Response: ', response.data)
      commit(GET_PATH_DATA_SUCCESS, response.data)
      dispatch('getPathFromParam')
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PATH_DATA_FAILURE, e)
    })
}

export const getPathFromParam = ({commit, state, dispatch}) => {
  let path = getPath()
  if (path) {
    commit(GET_PATH_FROM_PARAM_SUCCESS, path)
  } else {
    commit(GET_PATH_FROM_PARAM_FAILURE, path)
  }
}
