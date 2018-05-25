import {
  CLOSE_MODAL,
  OPEN_MODAL
} from './types'

const state = {
  modalOpen: false,
  showModalSpinner: false
}

const mutations = {

  [CLOSE_MODAL] (state) {
    state.modalOpen = false
  },

  [OPEN_MODAL] (state) {
    state.modalOpen = true
  }

}

export default { state, mutations }
