import {
  FETCHING_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_FAILURE,
  GET_PATH_FROM_PARAM_SUCCESS,
  GET_PATH_FROM_PARAM_FAILURE,
  WHITELIST_PROVIDER_FAILURE,
  WHITELIST_PROVIDER_SUCCESS,
  WHITELIST_CHANGE_PROVIDER_SECTOR_SUCCESS,
  WHITELIST_CHANGE_PROVIDER_SECTOR_FAILURE,
  GET_PROVIDERS_DATA_SUCCESS,
  GET_PROVIDERS_DATA_FAILURE
} from './types'
import axios from 'axios'

export const getDataDynamic = ({commit, dispatch}) => {
  commit(FETCHING_DATA, true)
  let parsedUrl = new URL(window.location.href)
  let path = parsedUrl.searchParams.get('path')
  axios.get(`${process.env.API_BASE_URL}/api/dataDynamic`, {params: {path}})
    .then(response => {
      console.log('Response: ', response.data)
      commit(GET_DATA_SUCCESS, response.data)
      dispatch('getPathFromParam2')
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_DATA_FAILURE, e)
    })
}

export const getProviderData = ({commit, dispatch}) => {
  commit(FETCHING_DATA, true)
  axios.get(`${process.env.API_BASE_URL}/api/data/providers`)
    .then(response => {
      console.log('Response: ', response.data)
      commit(GET_PROVIDERS_DATA_SUCCESS, response.data)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PROVIDERS_DATA_FAILURE, e)
    })
}

export const getMoreData = ({commit}) => {
  axios.get(`${process.env.API_BASE_URL}/api/fetchMoreData`)
    .then(response => {
      console.log('Response: ', response.data)
      commit(GET_DATA_SUCCESS, response.data)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_DATA_FAILURE, e)
    })
}

export const getPathFromParam2 = ({commit, state, dispatch}) => {
  let parsedUrl = new URL(window.location.href)
  let path = parsedUrl.searchParams.get('path')
  if (path) {
    commit(GET_PATH_FROM_PARAM_SUCCESS, path)
  } else {
    commit(GET_PATH_FROM_PARAM_FAILURE, path)
  }
}
export const whitelistAddProvider = ({commit, dispatch}, {name, sector}) => {
  axios.post(`${process.env.API_BASE_URL}/api/whitelist/addProvider`, {name, sector})
    .then(response => {
      let provider = response.data
      console.log('New Provider Data', provider)
      commit(WHITELIST_PROVIDER_SUCCESS, provider)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(WHITELIST_PROVIDER_FAILURE)
    })
}

export const providerChangeSector = ({commit, dispatch}, {id, sector}) => {
  axios.post(`${process.env.API_BASE_URL}/api/providers/changeSector`, {id, sector})
    .then(response => {
      let provider = response.data
      console.log('New Provider Data', provider)
      commit(WHITELIST_CHANGE_PROVIDER_SECTOR_SUCCESS, provider)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(WHITELIST_CHANGE_PROVIDER_SECTOR_FAILURE)
    })
}
