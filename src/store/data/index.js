import {
  FETCHING_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_FAILURE,
  VIEW_PROVIDER,
  GET_PAGE_PATH_FROM_PARAM_SUCCESS,
  GET_PAGE_PATH_FROM_PARAM_FAILURE,
  WHITELIST_PROVIDER_FAILURE,
  WHITELIST_PROVIDER_SUCCESS,
  WHITELIST_CHANGE_PROVIDER_SECTOR_SUCCESS,
  WHITELIST_CHANGE_PROVIDER_SECTOR_FAILURE
} from './types'

import { whitelist } from './whitelist'

const state = {
  error: false,
  // isViewingProvider: null,
  // isViewingPage: {
  //   id: null,
  //   path: null
  // },
  fetchingData: false,
  providers: {},
  pages: {},
  pagePathFromParam: null,
  pagePathFromParamStatus: null,
  page: {},
  pageFoundInStore: false,
  whitelistSectors: [],
  whitelist: whitelist
}

const mutations = {

  [FETCHING_DATA] (state, boolean) {
    state.fetchingData = boolean
  },

  [GET_DATA_SUCCESS] (state, { providers, pages, sessions, pageviews }) {
    state.error = false
    state.providers = providers
    state.pages = pages
    state.fetchingData = false
  },

  [GET_DATA_FAILURE] (state, error) {
    state.error = true
    state.fetchingData = false
  },

  [VIEW_PROVIDER] (state, providerID) {
    state.isViewingProvider = providerID
  },

  [GET_PAGE_PATH_FROM_PARAM_SUCCESS] (state, path) {
    state.pagePathFromParam = path
    state.pagePathFromParamStatus = 'success'
    let pathWithSlash = `${path}/`
    state.pageFoundInStore = state.pages.hasOwnProperty(path) || state.pages.hasOwnProperty(pathWithSlash)
    state.page = state.pages[path] || state.pages[pathWithSlash] || {}
    // state.isViewingPage = state.pages.filter((p) => p.path === path)[0]
  },

  [GET_PAGE_PATH_FROM_PARAM_FAILURE] (state, path) {
    state.pagePathFromParam = path
    state.pagePathFromParamStatus = 'fail'
  },

  [WHITELIST_PROVIDER_FAILURE] (state) {
  },

  [WHITELIST_PROVIDER_SUCCESS] (state, provider) {
    state.providers = state.providers.map((p) => {
      return p.id === provider.id ? provider : p
    })
  },

  [WHITELIST_CHANGE_PROVIDER_SECTOR_SUCCESS] (state, provider) {
    state.providers = state.providers.map((p) => {
      return p.id === provider.id ? provider : p
    })
  },

  [WHITELIST_CHANGE_PROVIDER_SECTOR_FAILURE] (state) {
  }

}

export default { state, mutations }
