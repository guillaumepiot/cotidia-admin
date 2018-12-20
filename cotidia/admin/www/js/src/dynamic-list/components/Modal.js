import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Button } from '@cotidia/react-ui'

import { Icon } from './elements/global'

let incrementingId = 0

const initialState = {
  id: null,
  data: {},
  bork: false,
  title: null,
}

function ModalContainer ({ children }) {
  const domNode = document.getElementById('modal-container')

  if (domNode) {
    return ReactDOM.createPortal(
      children,
      domNode
    )
  } else {
    return children
  }
}

ModalContainer.propTypes = {
  children: PropTypes.node,
}

export default class Modal extends Component {
  static propTypes = {
    cancelButton: PropTypes.string,
    close: PropTypes.bool,
    component: PropTypes.func,
    componentProps: PropTypes.object,
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    errors: PropTypes.object,
    form: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    headerLeft: PropTypes.shape({
      action: PropTypes.func.isRequired,
      label: PropTypes.node.isRequired,
    }),
    headerRight: PropTypes.shape({
      action: PropTypes.func.isRequired,
      label: PropTypes.node.isRequired,
    }),
    isOpen: PropTypes.bool,
    loading: PropTypes.bool,
    noPadding: PropTypes.bool,
    noValidate: PropTypes.bool,
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
    noPadding: false,
    noValidate: false,
  }

  state = initialState

  componentDidMount () {
    this.setState({
      id: `modal-${incrementingId++}`,
      title: this.props.title,
    })
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps (nextProps) {
    // If closing, reset modal to initial state.
    if (this.props.isOpen === true && nextProps.isOpen === false) {
      this.setState({
        data: initialState.data,
        bork: initialState.bork,
      })
    }

    // If opening, and we have data, set it.
    if (this.props.isOpen === false && nextProps.isOpen === true) {
      this.setState({
        data: nextProps.data,
        // Always reset the title when opening, as it gets reset to null on closing.
        title: nextProps.title,
      })
    }

    // If the title changes, update it in the state.
    if (this.props.title !== nextProps.title) {
      this.setState({ title: nextProps.title })
    }
  }

  componentDidCatch () {
    // TODO: Test whether the error is still caught by Sentry or whether we need to explicitly
    // TODO: capture it here.
    this.setState({ bork: true })
  }

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (this.props.headerLeft?.action) {
          e.preventDefault()
          this.callHeaderLeftAction()
        }
        break
      case 'ArrowRight':
        if (this.props.headerRight?.action) {
          e.preventDefault()
          this.callHeaderRightAction()
        }
        break
      case 'Escape':
        if (this.props.close) {
          e.preventDefault()
          this.props.handleClose()
        }
        break
    }
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

  setTitle = (title) => this.setState({ title })

  updateFormDataField = (field, value) => {
    this.setState((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
    }))
  }

  callHeaderLeftAction = () => {
    this.props.headerLeft.action(this.props.dispatch)
  }

  callHeaderRightAction = () => {
    this.props.headerRight.action(this.props.dispatch)
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
      headerLeft,
      headerRight,
      isOpen,
      noPadding,
      noValidate,
      otherButtons,
      size,
      submitButton,
    } = this.props

    const { bork, data, id, title } = this.state

    const component = Component && (
      <Component
        {...componentProps}
        closeModal={handleClose}
        data={data}
        errors={errors}
        handleSubmit={this.submitModal}
        setTitle={this.setTitle}
        updateField={this.updateFormDataField}
      />
    )

    return (
      <ModalContainer>
        <div className={`dialog dialog--modal ${isOpen ? 'dialog--modal-open' : ''} ${size ? `dialog--${size}` : ''}`} onClick={this.handleDialogueClick}>
          <div className='dialog__content'>
            { (title || close || headerLeft || headerRight) && (
              <div className='dialog__header dialog-header dialog-section--padded'>
                { headerLeft && (
                  <div className='dialog-header__action dialog-header__action--left' key='header-left'>
                    <button className='dialog-header__action-btn' onClick={this.callHeaderLeftAction}>
                      { headerLeft.label }
                    </button>
                  </div>
                ) }
                { title && (
                  <div className={`dialog-header__title ${headerLeft ? 'dialog-header__title--center' : ''}`}>
                    { title }
                  </div>
                ) }
                { headerRight ? (
                  <div className='dialog-header__action dialog-header__action--right' key='header-right'>
                    <button className='dialog-header__action-btn' onClick={this.callHeaderRightAction}>
                      { headerRight.label }
                    </button>
                  </div>
                ) : (close && (
                  <div className='dialog-header__action dialog-header__action--right' key='close-button'>
                    <button className='dialog-header__action-btn close-dialog' type='button' onClick={handleClose}>
                      <Icon icon='times' />
                    </button>
                  </div>
                )) }
              </div>
            ) }

            <div className={`dialog__body ${noPadding ? '' : 'dialog-section--padded'}`}>
              { bork ? (
                <p>Sorry, there has been an error in this modal.</p>
              ) : (form ? (
                <form id={id} noValidate={noValidate} onSubmit={this.submitModal}>
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
      </ModalContainer>
    )
  }
}
