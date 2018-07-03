import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Date extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    configureFilter: PropTypes.func.isRequired,
  }

  openDateRangePicker = () => this.props.configureFilter(this.props.name)

  render () {
    return (
      <div className='form__group'>
        <button onClick={this.openDateRangePicker} type='button'>
          Choose date range for {this.props.label}
        </button>
      </div>
    )
  }
}

import { connect } from 'react-redux'

import { configureFilter } from '../../redux/modules/search/actions'

const actionCreators = { configureFilter }

export default connect(null, actionCreators)(Date)
