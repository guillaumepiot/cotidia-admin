import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

export default class Header extends Component {
  static propTypes = {
    columnsConfigurable: PropTypes.bool.isRequired,
    hasListConfig: PropTypes.bool.isRequired,
    manageColumns: PropTypes.func.isRequired,
    mode: PropTypes.string,
    switchMode: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  manageColumns = (e) => {
    this.props.manageColumns()
  }

  displayList = () => {
    this.props.switchMode('list')
  }

  displayTable = () => {
    this.props.switchMode('table')
  }

  render () {
    const {
      columnsConfigurable,
      hasListConfig,
      mode,
      title,
    } = this.props

    return (
      <div className='content__head'>
        <div className='content__inner content-head'>
          <div className='content-head__title'>{title}</div>
          <div className='content-head__actions'>
            {mode === 'table' && columnsConfigurable && (
              <button className='btn btn--outline btn--small' onClick={this.manageColumns} title='Manage column' type='button'>
                <Icon icon='columns' />
              </button>
            )}

            {hasListConfig && (
              <>
                <button className={`btn btn--small ${mode === 'table' ? '' : 'btn--outline'}`} onClick={this.displayTable}>
                  <Icon icon='table' />
                </button>
                <button className={`btn btn--small ${mode === 'list' ? '' : 'btn--outline'}`} onClick={this.displayList}>
                  <Icon icon='bars' />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
}
