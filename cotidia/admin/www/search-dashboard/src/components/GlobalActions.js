import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from './elements/global'

export default class GlobalActions extends Component {
  static propTypes = {
    globalActions: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string.isRequired,
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
    })),
    performGlobalAction: PropTypes.func.isRequired,
  }

  performGlobalActionFactory = (action) => () => {
    this.props.performGlobalAction(action)
  }

  render () {
    const { globalActions } = this.props

    if (! globalActions) {
      return null
    }

    return (
      <div className='content__actions'>
        {globalActions.map((action) => (
          <button
            className={`btn btn--outline btn--small ${action.classes || ''}`}
            key={action.action}
            onClick={this.performGlobalActionFactory(action)}
            title={action.label}
            type='button'
          >
            {action.icon && (
              <>
                <Icon icon={action.icon} />
                {' '}
              </>
            )}
            {action.label}
          </button>
        ))}
      </div>
    )
  }
}
