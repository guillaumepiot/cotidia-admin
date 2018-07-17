import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { createStaticRanges } from 'react-date-range'

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
    className={`fa fa-${icon}${animating ? ' fa-spin' : ''}${fixed ? ' fa-fw' : ''}${size ? ` fa-${size}` : ''} ${className || ''}`}
  />
)

Icon.propTypes = {
  animating: PropTypes.bool,
  className: PropTypes.string,
  fixed: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
}

export const staticRanges = createStaticRanges([
  {
    label: 'Today',
    range: () => ({
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day'),
    }),
  },
  {
    label: 'Yesterday',
    range: () => ({
      startDate: moment().subtract(1, 'days').startOf('day'),
      endDate: moment().subtract(1, 'days').endOf('day'),
    }),
  },

  {
    label: 'This Week',
    range: () => ({
      startDate: moment().startOf('week'),
      endDate: moment().endOf('week'),
    }),
  },
  {
    label: 'Last Week',
    range: () => ({
      startDate: moment().subtract(1, 'weeks').startOf('week'),
      endDate: moment().subtract(1, 'weeks').endOf('week'),
    }),
  },
  {
    label: 'Month to Date',
    range: () => ({
      startDate: moment().startOf('month'),
      endDate: moment().endOf('day'),
    }),
  },
  {
    label: 'This Month',
    range: () => ({
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month'),
    }),
  },
  {
    label: 'Last Month',
    range: () => ({
      startDate: moment().subtract(1, 'months').startOf('month'),
      endDate: moment().subtract(1, 'months').endOf('month'),
    }),
  },
  {
    label: 'Year to Date',
    range: () => ({
      startDate: moment().startOf('year'),
      endDate: moment().endOf('day'),
    }),
  },
  {
    label: 'This Year',
    range: () => ({
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year'),
    }),
  },
  {
    label: 'Last Year',
    range: () => ({
      startDate: moment().subtract(1, 'years').startOf('year'),
      endDate: moment().subtract(1, 'years').endOf('year'),
    }),
  },
])
