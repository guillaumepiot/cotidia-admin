import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MultipleSelect } from '@cotidia/react-ui'

export default class MultipleSelectWidget extends Component {
  static propTypes = {
    apiEndpoint: PropTypes.string.isRequired,
    extraGroupClasses: PropTypes.arrayOf(PropTypes.string),
    initialValue: PropTypes.arrayOf(PropTypes.any).isRequired,
    minchars: PropTypes.number,
    name: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    minchars: 1,
    placeholder: '',
  }

  state = {
    options: [],
    value: this.props.initialValue,
  }

  searchOptions = async (q) => {
    const params = new URLSearchParams()

    params.set('q', q)

    try {
      const res = await fetch(
        `${this.props.apiEndpoint}?${params}`,
        {
          headers: { Accept: 'application/json' },
          credentials: 'include',
        }
      )

      if (res.ok) {
        const data = await res.json()

        this.setState({ options: data })
      }
    } catch {
      // pass
    }
  }

  updateSelected = ({ q }) => {
    this.setState({ value: q })
    this.props.onUpdate(q)
  }

  render () {
    return (
      <>
        {this.state.value && this.state.value.map((item) => (
          <input key={item.value} type='hidden' name={this.props.name} value={item.value} />
        ))}

        <MultipleSelect
          defaultOptions={this.props.defaultOptions}
          extraGroupClasses={this.props.extraGroupClasses}
          name='q'
          minCharSearch={this.props.minchars}
          options={this.state.options}
          placeholder={this.props.placeholder}
          prefix={<span className='fa fa-search' />}
          searchOptions={this.searchOptions}
          updateValue={this.updateSelected}
          values={this.state.value}
        />
      </>
    )
  }
}
