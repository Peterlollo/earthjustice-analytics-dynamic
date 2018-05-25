import {
  CLOSE_MODAL,
  OPEN_MODAL
} from './types'

export const closeModal = ({commit, dispatch}) => {
  commit(CLOSE_MODAL)
}

export const openModal = ({commit, dispatch}) => {
  commit(OPEN_MODAL)
}
