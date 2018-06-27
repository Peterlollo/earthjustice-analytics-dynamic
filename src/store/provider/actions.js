import {
  FETCHING_PROVIDER_DATA,
  GET_PROVIDER_DATA_SUCCESS,
  GET_PROVIDER_DATA_FAILURE,
  GET_PROVIDER_DATA_COMPLETE
} from './types'
import axios from 'axios'

export const getProviderData = ({commit, state, dispatch}) => {
  commit(FETCHING_PROVIDER_DATA, true)
  let daysAgo = state.path.googleAnalyticsDaysAgo
  axios.get(`${process.env.API_BASE_URL}/api/providers/data`, {params: {daysAgo}})
    .then(response => {
      // initial response will likely not contain all provider data
      // provider data can take a while to collect from GA, so we'll poll for it
      setTimeout(function () { pollProviders(commit) }, 2000)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PROVIDER_DATA_FAILURE, e)
    })
}

const pollProviders = (commit) => {
  axios.get(`${process.env.API_BASE_URL}/api/providers/pollData`)
    .then(response => {
      if (response.data.pageToken) { // still collecting provider data from GA
        commit(GET_PROVIDER_DATA_SUCCESS, response.data.reportData.providers)
        setTimeout(function () { pollProviders(commit) }, 2000)
      } else { // all provider data collected from GA
        commit(GET_PROVIDER_DATA_SUCCESS, response.data.reportData.providers)
        commit(GET_PROVIDER_DATA_COMPLETE)
      }
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PROVIDER_DATA_FAILURE, e)
    })
}
