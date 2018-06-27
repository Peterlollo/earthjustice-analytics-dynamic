import Vue from 'vue'
import Vuex from 'vuex'

import whitelist from './whitelist'
import * as whitelistActions from './whitelist/actions'
import * as whitelistGetters from './whitelist/getters'

import report from './report'
import * as reportActions from './report/actions'
import * as reportGetters from './report/getters'

import modal from './modal'
import * as modalActions from './modal/actions'
import * as modalGetters from './modal/getters'

Vue.use(Vuex)

const modules = {whitelist, report, modal}
const actions = Object.assign(whitelistActions, reportActions, modalActions)
const getters = Object.assign(whitelistGetters, reportGetters, modalGetters)
const store = new Vuex.Store({
  actions,
  getters,
  modules
})

Vue.use(store)

export default store
