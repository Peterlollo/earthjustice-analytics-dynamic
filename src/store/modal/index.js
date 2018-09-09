import {
  CLOSE_MODAL,
  OPEN_MODAL
} from './types'

const state = {
  modalOpen: false,
  showModalSpinner: false,
  modalName: ''
}

const mutations = {

  [CLOSE_MODAL] (state) {
    state.modalOpen = false
  },

  [OPEN_MODAL] (state, name) {
    state.modalOpen = true
    state.modalName = name
  }

}

export default { state, mutations }
