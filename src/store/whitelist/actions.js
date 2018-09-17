import {
  FETCHING_WHITELIST_DATA,
  GET_WHITELIST_DATA_SUCCESS,
  GET_WHITELIST_DATA_FAILURE,
  ADD_PROVIDER_TO_WHITELIST_SUCCESS,
  ADD_PROVIDER_TO_WHITELIST_FAILURE,
  REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS,
  REMOVE_PROVIDER_FROM_WHITELIST_FAILURE,
  SET_PROVIDER_TO_ADD,
  TOGGLE_PROVIDERS_LISTS
} from './types'

import axios from 'axios'

export const getWhitelistData = ({commit, dispatch}) => {
  commit(FETCHING_WHITELIST_DATA, true)
  axios.get(`${process.env.API_BASE_URL}/api/whitelist/data`)
    .then(response => {
      let whitelist = response.data
      commit(GET_WHITELIST_DATA_SUCCESS, whitelist)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_WHITELIST_DATA_FAILURE, e)
    })
}

export const whitelistAddProvider = ({commit, dispatch}, {name, sector}) => {
  axios.post(`${process.env.API_BASE_URL}/api/whitelist/addProvider`, {name, sector})
    .then(response => {
      let whitelist = response.data
      commit(ADD_PROVIDER_TO_WHITELIST_SUCCESS, whitelist)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(ADD_PROVIDER_TO_WHITELIST_FAILURE)
    })
}

export const whitelistRemoveProvider = ({commit, dispatch}, {name}) => {
  axios.post(`${process.env.API_BASE_URL}/api/whitelist/removeProvider`, {name})
    .then(response => {
      let whitelist = response.data
      commit(REMOVE_PROVIDER_FROM_WHITELIST_SUCCESS, whitelist)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(REMOVE_PROVIDER_FROM_WHITELIST_FAILURE)
    })
}

export const setProviderToAdd = ({commit}, provider) => {
  commit(SET_PROVIDER_TO_ADD, provider)
}

export const toggleProvidersLists = ({commit}, list) => {
  commit(TOGGLE_PROVIDERS_LISTS, list)
}
