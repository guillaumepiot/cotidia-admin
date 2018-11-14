import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  debounce,
  getFilterLabel,
} from '../utils'

import { filterConfiguration } from '../utils/propTypes'

import * as TOOLBAR_FILTERS from './fields/toolbar-filters'

import { Select, TextInput } from '@cotidia/react-ui'

import { Icon } from './elements/global'

export default class ToolBar extends Component {
  static propTypes = {
    allowedResultsModes: PropTypes.array.isRequired,
    anyResultsSelected: PropTypes.bool.isRequired,
    batchActions: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string.isRequired,
      endpoint: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onComplete: PropTypes.func,
    })),
    cacheFilterLabel: PropTypes.func,
    clearFilters: PropTypes.func.isRequired,
    columnsConfigurable: PropTypes.bool.isRequired,
    config: PropTypes.object,
    filterConfiguration: filterConfiguration.isRequired,
    filters: PropTypes.object,
    filterSuggest: PropTypes.func,
    getSuggestEngine: PropTypes.func.isRequired,
    hasSidebar: PropTypes.bool.isRequired,
    manageColumns: PropTypes.func.isRequired,
    resultsMode: PropTypes.string.isRequired,
    performBatchAction: PropTypes.func.isRequired,
    removeFilterValue: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    setFilterValue: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    switchMode: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    toolbarFilters: PropTypes.array,
  }

  static defaultProps = {
    batchActions: [],
    filters: {},
    searchTerm: '',
    toolbarFilters: [],
  }

  state = {
    action: '',
    filterSuggestions: [],
    filterSuggestionsLoading: false,
  }

  toggleSidebar = () => this.props.toggleSidebar()

  updateSearchTerm = debounce(250, ({ searchTerm }) => this.props.setSearchTerm(searchTerm))

  updateFilterValueFactory = (filter) => (value) => this.props.setFilterValue(filter, value)

  clearSearchTerm = (e) => {
    this.props.clearFilters()
  }

  manageColumns = (e) => this.props.manageColumns()

  displayList = () => this.props.switchMode('list')
  displayMap = () => this.props.switchMode('map')
  displayTable = () => this.props.switchMode('table')

  selectBatchAction = (e) => this.setState({ action: e.target.value })

  performSelectedBatchAction = () => {
    if (this.state.action && this.state.action.length) {
      this.props.performBatchAction(this.state.action)
    }
  }

  performBatchActionFactory = (action) => () => {
    this.props.performBatchAction(action)
  }

  getFilterSuggestions = async (q) => {
    // First set our state to searching and clear the currnent suggestions
    this.setState({
      filterSuggestions: [],
      filterSuggestionsLoading: true,
    })

    // Now fire off the suggestion lookups.
    this.props.filterSuggest(q).then((suggestions) => {
      this.setState({ filterSuggestions: suggestions })
    }).finally(() => this.setState({ filterSuggestionsLoading: false }))

    // We want the Select to think we came back with immediate results so that we don't hide what's
    // in the list while we loasd the new results.
    return Promise.resolve()
  }

  handleFilterSuggestionSelect = ({ q }) => {
    const filter = q.slice(0, q.indexOf(':'))
    let value = q.slice(q.indexOf(':') + 1)

    // First find the full option object from state.
    const item = this.state.filterSuggestions.find((item) => item.value === q)

    // Now cache the label for the value so it can be accessed later.
    if (item) {
      this.props.cacheFilterLabel(filter, value, item.label)
    }

    // If the filter is a choice filter, technically that allows multiple selection, so we get the
    // existing filter value (or an empty array if there isn't one) and add the passed value to it.
    if (this.props.filterConfiguration[filter].filter === 'choice') {
      const existingValues = this.props.filters[filter] || []
      value = existingValues.concat([value])
    }

    this.props.setFilterValue(filter, value)
  }

  renderFilterSuggestToolbar () {
    const {
      filterSuggestionsLoading,
      filterSuggestions,
    } = this.state

    return (
      <div className='content-filter__item content-filter__item--wide'>
        <div className='form__group form__group--boxed'>
          <label htmlFor='search' className='form__label'>Search</label>
          <Select
            controlOnly
            minCharSearch={2}
            name='q'
            placeholder='Start typing to filter...'
            prefix={<Icon icon='search' />}
            searchOptions={this.getFilterSuggestions}
            suffix={filterSuggestionsLoading && <Icon icon='spinner' pulse />}
            options={filterSuggestions}
            updateValue={this.handleFilterSuggestionSelect}
          />
        </div>
      </div>
    )
  }

  renderSearchToolbar () {
    const {
      cacheFilterLabel,
      filterConfiguration,
      filters,
      filterSuggest,
      getSuggestEngine,
      searchTerm,
      toolbarFilters,
    } = this.props

    if (filterSuggest) {
      return this.renderFilterSuggestToolbar()
    }

    return (
      <>
        <div className='content-filter__item'>
          <div className='form__group form__group--boxed'>
            <label htmlFor='search' className='form__label'>Search</label>
            <TextInput
              controlOnly
              id='search'
              label='Search'
              name='searchTerm'
              placeholder='Search'
              prefix={<Icon icon='search' />}
              type='text'
              updateValue={this.updateSearchTerm}
              updateValueOnBlur={false}
              value={searchTerm}
            />
          </div>
        </div>

        {toolbarFilters && toolbarFilters.map((filter) => {
          const {
            configuration,
            filter: type,
            label,
            name,
          } = filter

          let Component

          if (type === 'boolean') {
            Component = TOOLBAR_FILTERS.Boolean
          } else if (type === 'text') {
            Component = TOOLBAR_FILTERS.Text
          } else if (type === 'number') {
            Component = TOOLBAR_FILTERS.Number
          } else if (type === 'date') {
            Component = TOOLBAR_FILTERS.Date
          } else if (type === 'choice') {
            if (configuration.mode === 'options') {
              Component = TOOLBAR_FILTERS.Choice
            } else {
              Component = TOOLBAR_FILTERS.Suggest
            }
          } else if (type === 'choice-single') {
            if (configuration.mode === 'options') {
              Component = TOOLBAR_FILTERS.ChoiceSingle
            } else {
              Component = TOOLBAR_FILTERS.SuggestSingle
            }
          }

          if (Component) {
            return (
              <div className='content-filter__item' key={filter.name}>
                <Component
                  cacheFilterLabel={cacheFilterLabel}
                  configuration={configuration}
                  filter={type}
                  label={label}
                  name={name}
                  suggest={getSuggestEngine(filter.configuration, filterConfiguration)}
                  updateValue={this.updateFilterValueFactory(filter.name)}
                  value={filters[filter.name]}
                />
              </div>
            )
          }
        })}
      </>
    )
  }

  renderBatchActionToolbar () {
    const {
      batchActions,
    } = this.props

    if (batchActions.length < 3) {
      return batchActions.map((action) => (
        <div className='content-filter__item' key={action.action}>
          <button
            className='btn btn--outline'
            onClick={this.performBatchActionFactory(action.action)}
            title={action.label}
            type='button'
          >
            {action.label}
          </button>
        </div>
      ))
    } else {
      return (
        <>
          <div className='content-filter__item'>
            <div className='form__group form__group--boxed'>
              <div className='form__control form__control--select'>
                <select
                  className='form__select'
                  onChange={this.selectBatchAction}
                  value={this.state.action}
                >
                  <option value=''>Choose an action</option>

                  {batchActions.map((action) => (
                    <option key={action.action} value={action.action}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='content-filter__item'>
            <button
              className='btn btn--outline'
              onClick={this.performSelectedBatchAction}
              type='button'
            >
              Go
            </button>
          </div>
        </>
      )
    }
  }

  renderFilterTag = (filter, value) => {
    // If the filter doesn't exist, skip it.
    if (! this.props.filterConfiguration[filter]) {
      return
    }

    // If the value is the equivalent of "unset", skip it.
    if (value == null) {
      return
    }

    let filterName = this.props.filterConfiguration[filter].label

    let filterLabel = getFilterLabel(
      this.props.filterConfiguration[filter],
      filter,
      value,
      this.props.config
    )

    // If there's no label, that means we should show the name as the label and not show the name.
    if (filterLabel === null) {
      filterLabel = filterName
      filterName = null
    }

    let serialisedValue = value

    if (value.min && value.max) {
      serialisedValue = `${value.min}-${value.max}`
    }

    return (
      <div className='tag' key={`${filter}:${serialisedValue}`}>
        {filterName && (
          <span className='tag__category'>{filterName}</span>
        )}
        {filterLabel && (
          <span className='tag__label'>{filterLabel}</span>
        )}
        <button
          className='tag__clear btn btn--small'
          onClick={() => this.props.removeFilterValue(filter, value)}
          type='button'
        >
          <Icon icon='times' />
        </button>
      </div>
    )
  }

  render () {
    const {
      allowedResultsModes,
      anyResultsSelected,
      columnsConfigurable,
      filterSuggest,
      filters,
      resultsMode,
      hasSidebar,
    } = this.props

    return (
      <>
        <div className='content__toolbar'>
          <div className='content__filter content-filter form--animate'>
            {anyResultsSelected ? this.renderBatchActionToolbar() : this.renderSearchToolbar()}
          </div>

          <div className='content__actions'>
            {resultsMode === 'table' && columnsConfigurable && (
              <button className='btn btn--outline' onClick={this.manageColumns} title='Manage column' type='button'>
                <Icon icon='columns' />
              </button>
            )}

            {allowedResultsModes.length > 1 && (
              <>
                {allowedResultsModes.includes('table') && (
                  <button className={`btn ${resultsMode === 'table' ? '' : 'btn--outline'}`} onClick={this.displayTable}>
                    <Icon icon='table' />
                  </button>
                )}
                {allowedResultsModes.includes('list') && (
                  <button className={`btn ${resultsMode === 'list' ? '' : 'btn--outline'}`} onClick={this.displayList}>
                    <Icon icon='bars' />
                  </button>
                )}
                {allowedResultsModes.includes('map') && (
                  <button className={`btn ${resultsMode === 'map' ? '' : 'btn--outline'}`} onClick={this.displayMap}>
                    <Icon icon='map-marker-alt' />
                  </button>
                )}
              </>
            )}

            <button className='btn btn--outline' onClick={this.clearSearchTerm} title='Reset filters' type='button'>
              <Icon icon='sync-alt' />
            </button>

            {hasSidebar && (
              <button className='btn btn--outline' onClick={this.toggleSidebar}>
                <Icon icon='filter' />
              </button>
            )}
          </div>
        </div>
        {filterSuggest && (Object.values(filters).length > 0) && (
          <div className='content__filters'>
            {Object.entries(filters).map(([filter, value]) => {
              if (Array.isArray(value)) {
                const tags = []

                for (const singleValue of value) {
                  tags.push(this.renderFilterTag(filter, singleValue))
                }

                return tags
              }

              return this.renderFilterTag(filter, value)
            })}
          </div>
        )}
      </>
    )
  }
}
