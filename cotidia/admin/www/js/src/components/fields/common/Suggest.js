import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MultipleSelect, Select } from '@cotidia/react-ui'

import { Icon } from '../../elements/global'

export default class Suggest extends Component {
  static propTypes = {
    cacheFilterLabel: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    name: PropTypes.string.isRequired,
    suggest: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
  }

  state = {
    optionsLoading: false,
    options: [],
  }

  getSuggestions = async (value) => {
    // First set our state to searching and clear the currnent suggestions
    this.setState({
      options: [],
      optionsLoading: true,
    })

    // Now fire off the suggestion lookups.
    this.props.suggest(value).then((suggestions) => {
      this.setState({ options: suggestions })
    }).finally(() => this.setState({ optionsLoading: false }))

    // We want the Select to think we came back with immediate results so that we don't hide what's
    // in the list while we loasd the new results.
    return Promise.resolve()
  }

  handleSuggestionSelect = ({ [this.props.name]: value }) => {
    // "Cache" the label of the selected value(s)
    if (this.props.multiple) {
      // We need an arra of values here, not objects, so let's map over them and get what we want.
      // However, we also require caching of the label sof each item, so while we're mapping, let's
      // cache those labels.
      value = value.map((item) => {
        this.props.cacheFilterLabel(this.props.name, item.value, item.label)
        return item.value
      })
    } else {
      // Not in multiple mode - just cache the value (here we need to find it first...)
      this.cacheItemByValue(value)
    }

    // Finally send the updated value up the chain.
    this.props.updateValue(value)
  }

  cacheItemByValue (value) {
    // First find the full option object from state.
    const item = this.state.options.find((item) => item.value === value)

    // Now cache the label for the value so it can be accessed later.
    if (item) {
      this.props.cacheFilterLabel(this.props.name, item.value, item.label)
    }
  }

  render () {
    const {
      cacheFilterLabel,
      multiple,
      suggest,
      updateValue,
      ...props
    } = this.props

    const {
      optionsLoading,
      options,
    } = this.state

    return multiple ? (
      <MultipleSelect
        {...props}
        minCharSearch={2}
        searchOptions={this.getSuggestions}
        suffix={optionsLoading && <Icon icon='spinner' pulse />}
        options={options}
        updateValue={this.handleSuggestionSelect}
      />
    ) : (
      <Select
        {...props}
        minCharSearch={2}
        searchOptions={this.getSuggestions}
        suffix={optionsLoading && <Icon icon='spinner' pulse />}
        options={options}
        updateValue={this.handleSuggestionSelect}
      />
    )
  }
}
