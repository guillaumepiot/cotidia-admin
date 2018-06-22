import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button } from '@cotidia/react-ui'

import { Icon } from './elements/global'

let incrementingId = 0

const initialState = {
  id: null,
  data: {},
  bork: false,
}

export default class Modal extends Component {
  static propTypes = {
    cancelButton: PropTypes.string,
    close: PropTypes.bool,
    component: PropTypes.func,
    componentProps: PropTypes.object,
    data: PropTypes.object.isRequired,
    errors: PropTypes.object,
    form: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    loading: PropTypes.bool,
    otherButtons: PropTypes.node,
    size: PropTypes.string,
    submitButton: PropTypes.string,
    title: PropTypes.string,
  }

  static defaultProps = {
    close: true,
    componentProps: {},
    errors: {},
    form: false,
    isOpen: false,
    loading: false,
  }

  state = initialState

  componentWillMount () {
    this.setState({
      id: `modal-${incrementingId++}`,
    })
  }

  componentWillReceiveProps (nextProps) {
    // If closing, reset modal to initial state.
    if (this.props.isOpen === true && nextProps.isOpen === false) {
      this.setState({ data: initialState.data })
    }

    // If opening, and we have data, set it.
    if (this.props.isOpen === false && nextProps.isOpen === true) {
      this.setState({ data: nextProps.data })
    }
  }

  componentDidCatch () {
    this.setState({ bork: true })
  }

  handleDialogueClick = (e) => {
    // If we allow closing *and* the thing that was clicked was actually the dialogue itself (as
    // opposed to a button or input within it), then close.
    if (this.props.close && e.target.classList.contains('dialog')) {
      this.props.handleClose()
    }
  }

  submitModal = (e) => {
    e.preventDefault()
    this.props.handleSubmit(this.state.data)
  }

  updateFormDataField = (field, value) => {
    this.setState((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
    }))
  }

  render () {
    const {
      cancelButton,
      close,
      component: Component,
      componentProps,
      form,
      errors,
      handleClose,
      isOpen,
      otherButtons,
      size,
      submitButton,
      title,
    } = this.props

    const { bork, data, id } = this.state

    const component = Component && (
      <Component
        {...componentProps}
        closeModal={handleClose}
        data={data}
        errors={errors}
        handleSubmit={this.submitModal}
        updateField={this.updateFormDataField}
      />
    )

    return (
      <div className={`dialog dialog--modal ${isOpen ? 'dialog--modal-open' : ''} ${size ? `dialog--${size}` : ''}`} onClick={this.handleDialogueClick}>
        <div className='dialog__content'>
          { (title || close) && (
            <div className='dialog__header dialog-header dialog-section--padded'>
              { title && (
                <div className='dialog-header__title'>{ title }</div>
              ) }
              { close && (
                <div className='dialog-header__action dialog-header__action--right'>
                  <button className='dialog-header__action-btn close-dialog' type='button' onClick={handleClose}>
                    <Icon icon='times' />
                  </button>
                </div>
              ) }
            </div>
          ) }
          <div className='dialog__body dialog-section--padded'>
            { bork ? (
              <p>Something has gone horribly wrong!</p>
            ) : (form ? (
              <form id={id} onSubmit={this.submitModal}>
                { component }
              </form>
            ) : component) }
          </div>
          { form && (
            <div className='dialog__footer dialog-footer dialog-section--padded dialog-footer--reverse'>
              { submitButton && (
                <div className='dialog-footer__actions'>
                  <Button buttonOnly form={id} type='submit' status='primary' loading={this.props.loading}>
                    { submitButton }
                  </Button>
                </div>
              ) }
              { cancelButton && (
                <div className='dialog-footer__actions'>
                  <Button buttonOnly status='cancel' className='close-dialog' onClick={handleClose}>
                    { cancelButton }
                  </Button>
                </div>
              ) }
              { otherButtons && (
                <div className='dialog-footer__actions'>
                  { otherButtons }
                </div>
              ) }
            </div>
          ) }
        </div>
      </div>
    )
  }
}
