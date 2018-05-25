import Vue from 'vue'
import Vuex from 'vuex'

import whitelist from './whitelist'
import * as whitelistActions from './whitelist/actions'
import * as whitelistGetters from './whitelist/getters'

import path from './path'
import * as pathActions from './path/actions'
import * as pathGetters from './path/getters'

import provider from './provider'
import * as providerActions from './provider/actions'
import * as providerGetters from './provider/getters'

import modal from './modal'
import * as modalActions from './modal/actions'
import * as modalGetters from './modal/getters'

Vue.use(Vuex)

const modules = {whitelist, path, provider, modal}
const actions = Object.assign(whitelistActions, pathActions, providerActions, modalActions)
const getters = Object.assign(whitelistGetters, pathGetters, providerGetters, modalGetters)
const store = new Vuex.Store({
  actions,
  getters,
  modules
})

Vue.use(store)

export default store
