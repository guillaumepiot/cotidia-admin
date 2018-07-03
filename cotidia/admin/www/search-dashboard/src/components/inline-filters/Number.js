import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextInput } from '@cotidia/react-ui'

export default class Number extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.shape({
      min: PropTypes.string.isRequired,
      max: PropTypes.string.isRequired,
    }),
  }

  updateMin = ({ min }) => this.props.updateValue({ ...this.props.value, min })
  updateMax = ({ max }) => this.props.updateValue({ ...this.props.value, max })

  render () {
    const { label, value } = this.props

    return (
      <>
        <div className='form__group'>
          <label className='form__label'>{label} is at least</label>
          <div className='form__control'>
            <TextInput
              autoFocus
              controlOnly
              name='min'
              type='number'
              updateValue={this.updateMin}
              value={value?.min}
            />
          </div>
        </div>
        <div className='form__group'>
          <label className='form__label'>and at most</label>
          <div className='form__control'>
            <TextInput
              controlOnly
              name='max'
              type='number'
              updateValue={this.updateMax}
              value={value?.max}
            />
          </div>
        </div>
      </>
    )
  }
}
