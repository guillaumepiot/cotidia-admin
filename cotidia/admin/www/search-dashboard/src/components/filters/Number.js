import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Number extends Component {
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
    updateField: PropTypes.func.isRequired,
  }

  updateMin = ({ min }) => this.props.updateField('value', { ...this.props.data.value, min })
  updateMax = ({ max }) => this.props.updateField('value', { ...this.props.data.value, max })

  render () {
    return (
      <>
        <div className='form__group'>
          <label className='form__label'>{this.props.config.label} is at least</label>
          <div className='form__control'>
            <TextInput
              autoFocus
              name='min'
              type='number'
              updateValue={this.updateMin}
              updateValueOnBlur={false}
              value={this.props.data.value?.min}
            />
          </div>
        </div>
        <div className='form__group'>
          <label className='form__label'>and at most</label>
          <div className='form__control'>
            <TextInput
              name='max'
              type='number'
              updateValue={this.updateMax}
              updateValueOnBlur={false}
              value={this.props.data.value?.max}
            />
          </div>
        </div>
      </>
    )
  }
}
