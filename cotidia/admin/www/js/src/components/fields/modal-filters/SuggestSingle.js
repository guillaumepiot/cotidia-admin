import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Suggest from '../common/Suggest'

export default class SuggestSingle extends Component {
  static propTypes = {
    cacheFilterLabel: PropTypes.func.isRequired,
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
    filter: PropTypes.string.isRequired,
    suggest: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
  }

  updateValue = (value) => this.props.updateField('value', value)

  render () {
    const {
      cacheFilterLabel,
      config: { label },
      data,
      suggest,
    } = this.props

    return (
      <div className='form__group'>
        <label className='form__label'>{label} is</label>
        <div className='form__control'>
          <Suggest
            cacheFilterLabel={cacheFilterLabel}
            suggest={suggest}
            name={this.props.filter}
            updateValue={this.updateValue}
            value={data.value || ''}
          />
        </div>
      </div>
    )
  }
}
