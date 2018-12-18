import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getFilterLabel } from '../../../utils'

import Suggest from '../common/Suggest'

export default class SuggestMultiple extends Component {
  static propTypes = {
    cacheFilterLabel: PropTypes.func.isRequired,
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.arrayOf(PropTypes.string),
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

    const values = data.value?.map(
      (value) => ({
        value,
        // Blank config for now as we don't receive it. Only *really* used for dates anyway.
        label: getFilterLabel(this.props.config, this.props.filter, value, {}),
      })
    )

    return (
      <div className='form__group'>
        <label className='form__label'>{label} is any of</label>
        <div className='form__control'>
          <Suggest
            cacheFilterLabel={cacheFilterLabel}
            multiple
            name={this.props.filter}
            suggest={suggest}
            updateValue={this.updateValue}
            values={values}
          />
        </div>
      </div>
    )
  }
}
