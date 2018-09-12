import {
  FETCHING_WATCHLIST_DATA,
  GET_WATCHLIST_DATA_SUCCESS,
  GET_WATCHLIST_DATA_FAILURE,
  ADD_PROVIDER_TO_WATCHLIST_SUCCESS,
  ADD_PROVIDER_TO_WATCHLIST_FAILURE,
  REMOVE_PROVIDER_FROM_WATCHLIST_SUCCESS,
  REMOVE_PROVIDER_FROM_WATCHLIST_FAILURE,
  SET_PROVIDER_TO_ADD
} from './types'

import axios from 'axios'

export const getWatchlistData = ({commit, dispatch}) => {
  commit(FETCHING_WATCHLIST_DATA, true)
  axios.get(`${process.env.API_BASE_URL}/api/watchlist/data`)
    .then(response => {
      let watchlist = response.data
      console.log('watchlist: ', watchlist)
      commit(GET_WATCHLIST_DATA_SUCCESS, watchlist)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_WATCHLIST_DATA_FAILURE, e)
    })
}

export const watchlistAddProvider = ({commit, dispatch}, {name}) => {
  axios.post(`${process.env.API_BASE_URL}/api/watchlist/addProvider`, {name})
    .then(response => {
      let watchlist = response.data
      commit(ADD_PROVIDER_TO_WATCHLIST_SUCCESS, watchlist)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(ADD_PROVIDER_TO_WATCHLIST_FAILURE)
    })
}

export const watchlistRemoveProvider = ({commit, dispatch}, {name}) => {
  axios.post(`${process.env.API_BASE_URL}/api/watchlist/removeProvider`, {name})
    .then(response => {
      let watchlist = response.data
      commit(REMOVE_PROVIDER_FROM_WATCHLIST_SUCCESS, watchlist)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(REMOVE_PROVIDER_FROM_WATCHLIST_FAILURE)
    })
}

export const setProviderToAdd = ({commit}, provider) => {
  commit(SET_PROVIDER_TO_ADD, provider)
}
