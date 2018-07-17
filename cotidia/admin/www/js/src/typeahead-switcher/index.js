import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Select } from '@cotidia/react-ui'

export default class TypeaheadSwitcher extends Component {
  static propTypes = {
    apiEndpoint: PropTypes.string.isRequired,
    extraGroupClasses: PropTypes.arrayOf(PropTypes.string),
    minchars: PropTypes.number,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    minchars: 1,
    placeholder: '',
  }

  state = {
    options: [],
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

  routeOption = ({ q }) => {
    location.href = q
  }

  render () {
    return (
      <Select
        extraGroupClasses={this.props.extraGroupClasses}
        name='q'
        minCharSearch={this.props.minchars}
        options={this.state.options}
        placeholder={this.props.placeholder}
        prefix={<span className='fa fa-search' />}
        searchOptions={this.searchOptions}
        updateValue={this.routeOption}
      />
    )
  }
}
