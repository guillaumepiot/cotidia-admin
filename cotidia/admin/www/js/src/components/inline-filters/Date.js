import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../../utils/resultItems'

class Date extends Component {
  static propTypes = {
    config: PropTypes.object,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    configureFilter: PropTypes.func.isRequired,
    value: PropTypes.shape({
      max: PropTypes.string,
      min: PropTypes.string,
    }),
  }

  openDateRangePicker = () => this.props.configureFilter(this.props.name)

  render () {
    const {
      config,
      value,
    } = this.props

    const formatValue = getValueFormatter(config)

    const min = formatValue(value, 'min', 'date')
    const max = formatValue(value, 'max', 'date')

    return (
      <div className='form__group'>
        <button className='btn btn--outline' onClick={this.openDateRangePicker} type='button'>
          Choose date range for {this.props.label}
        </button>
        {value && `${min} – ${max}`}
      </div>
    )
  }
}

import { connect } from 'react-redux'

import { configureFilter } from '../../redux/modules/search/actions'

const mapStateToProps = (state) => ({
  config: state.config,
})

const actionCreators = { configureFilter }

export default connect(mapStateToProps, actionCreators)(Date)
