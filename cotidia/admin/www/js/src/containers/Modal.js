import { connect } from 'react-redux'

import Modal from '../components/Modal'

import { closeModal, submitModal } from '../redux/modules/modal/actions'

import * as modalMap from '../utils/modalMap'

const mapStateToProps = (state) => ({
  ...state.modal.modalProps,

  isOpen: Boolean(state.modal.component),

  component: modalMap[state.modal.component],
  componentProps: state.modal.componentProps,

  data: state.modal?.data || {},
})

const actionCreators = {
  handleClose: closeModal,
  handleSubmit: submitModal,
}

export default connect(mapStateToProps, actionCreators)(Modal)
