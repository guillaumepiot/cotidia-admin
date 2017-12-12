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

export const Icon = ({ icon, size, animating }) => (
  <span
    className={`fa fa-${icon}${animating ? ' fa-spin' : ''}${size ? ` fa-${size}` : ''}`}
  />
)

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  animating: PropTypes.string,
}