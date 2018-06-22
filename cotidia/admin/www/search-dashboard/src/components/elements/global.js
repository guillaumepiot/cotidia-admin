import React from 'react'
import PropTypes from 'prop-types'

export const FullScreen = ({ children }) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
    }}
  >
    {children}
  </div>
)

FullScreen.propTypes = {
  children: PropTypes.node,
}

export const Icon = ({ animating, className, fixed, icon, size }) => (
  <span
    className={`fa fa-${icon}${animating ? ' fa-spin' : ''}${fixed ? ' fa-fw' : ''}${size ? ` fa-${size}` : ''} ${className}`}
  />
)

Icon.propTypes = {
  animating: PropTypes.bool,
  className: PropTypes.string,
  fixed: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
}
