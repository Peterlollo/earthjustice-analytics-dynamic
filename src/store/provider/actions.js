import {
  FETCHING_PROVIDER_DATA,
  GET_PROVIDER_DATA_SUCCESS,
  GET_PROVIDER_DATA_FAILURE
} from './types'
import axios from 'axios'

export const getProviderData = ({commit, dispatch}) => {
  commit(FETCHING_PROVIDER_DATA, true)
  axios.get(`${process.env.API_BASE_URL}/api/providers/data`)
    .then(response => {
      console.log('Response: ', response.data)
      commit(GET_PROVIDER_DATA_SUCCESS, response.data)
    })
    .catch(e => {
      console.log('Error: ', e)
      commit(GET_PROVIDER_DATA_FAILURE, e)
    })
}
