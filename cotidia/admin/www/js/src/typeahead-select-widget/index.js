import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MultipleSelect, Select } from '@cotidia/react-ui'

export default class TypeaheadSelectWidget extends Component {
  static propTypes = {
    apiEndpoint: PropTypes.string.isRequired,
    defaultOptions: PropTypes.arrayOf(PropTypes.any),
    extraGroupClasses: PropTypes.arrayOf(PropTypes.string),
    initialValue: PropTypes.arrayOf(PropTypes.any).isRequired,
    label: PropTypes.string,
    minchars: PropTypes.number,
    multiple: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onUpdate: PropTypes.func,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    minchars: 1,
    multiple: false,
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

  updateSelected = (data) => {
    let value

    if (this.props.multiple) {
      value = data.q
    } else {
      value = data[this.props.name]
    }

    this.setState({ value })
    this.props.onUpdate && this.props.onUpdate(value)
  }

  render () {
    const {
      apiEndpoint,
      initialValue,
      minchars,
      multiple,
      onUpdate,
      ...passThruProps
    } = this.props

    const {
      options,
      value,
    } = this.state

    const props = {
      ...passThruProps,
      minCharSearch: minchars,
      options,
      prefix: <span className='fa fa-search' />,
      searchOptions: this.searchOptions,
      updateValue: this.updateSelected,
    }

    return multiple ? (
      <>
        {value && value.map((item) => (
          <input key={item.value} type='hidden' name={this.props.name} value={item.value} />
        ))}

        <MultipleSelect {...props} name='q' values={value} />
      </>
    ) : (
      <Select {...props} value={value} />
    )
  }
}
