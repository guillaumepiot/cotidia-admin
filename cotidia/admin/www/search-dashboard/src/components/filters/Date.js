import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import './dateRangeOverrides.css'

import { DateRangePicker, createStaticRanges } from 'react-date-range'

const staticRanges = createStaticRanges([
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

export default class Date extends Component {
  static propTypes = {
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.shape({
        min: PropTypes.string,
        max: PropTypes.string,
      }),
    }).isRequired,
    globalConfig: PropTypes.shape({
      primaryColor: PropTypes.string,
    }),
    updateField: PropTypes.func.isRequired,
  }

  handleDateRangeSelect = (ranges) => {
    this.props.updateField('value', {
      min: moment(ranges.selection.startDate).format('YYYY-MM-DD'),
      max: moment(ranges.selection.endDate).format('YYYY-MM-DD'),
    })
  }

  render () {
    const selectionRange = {
      startDate: moment(this.props.data.value?.min),
      endDate: moment(this.props.data.value?.max),
      key: 'selection',
      color: this.props.globalConfig.primaryColor,
    }

    return (
      <>
        <p>{this.props.config.label} is within the range:</p>

        <DateRangePicker
          dateDisplayFormat='YYYY-MM-DD'
          staticRanges={staticRanges}
          months={2}
          onChange={this.handleDateRangeSelect}
          ranges={[selectionRange]}
        />
      </>
    )
  }
}
