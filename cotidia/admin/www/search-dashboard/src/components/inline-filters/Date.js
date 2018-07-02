import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import '../elements/dateRangeOverrides.css'

import { DateRangePicker } from 'react-date-range'
import { staticRanges } from '../elements/global'

export default class Date extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    // name: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.shape({
      min: PropTypes.string,
      max: PropTypes.string,
    }),
  }

  updateValue = ({ [this.props.name]: value }) => this.props.updateValue(value)


  handleDateRangeSelect = (ranges) => {
    this.props.updateValue({
      min: moment(ranges.selection.startDate).format('YYYY-MM-DD'),
      max: moment(ranges.selection.endDate).format('YYYY-MM-DD'),
    })
  }

  render () {
    const selectionRange = {
      startDate: moment(this.props.data.value?.min),
      endDate: moment(this.props.data.value?.max),
      key: 'selection',
      // color: this.props.globalConfig.primaryColor,
    }

    return (
      <>
        <p>{this.props.label} is within the range:</p>

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
