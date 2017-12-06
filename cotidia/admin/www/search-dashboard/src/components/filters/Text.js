import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Text extends Component {
  static propTypes = {
    config: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
    filter: PropTypes.string.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
  }

  updateValue = ({ value }) => this.props.updateField('value', value)

  setFilterValue = (e) => this.props.setFilterValue(this.props.filter, this.state.value)

  render () {
    return (
      <div className='form__group'>
        <label className='form__label'>{this.props.config.label} contains</label>
        <div className='form__control'>
          <TextInput
            name='value'
            type='text'
            updateValue={this.updateValue}
            updateValueOnBlur={false}
            value={this.props.data.value}
          />
        </div>
      </div>
    )
  }
}
