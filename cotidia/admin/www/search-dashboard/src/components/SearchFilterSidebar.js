import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import { debounce } from '../utils'

// import { Boolean } from './inline-filters'

// import { TextInput } from '@cotidia/react-ui'

// import { Icon } from './elements/global'

export default class SearchFilterSidebar extends Component {
  static propTypes = {
    // batchActions: PropTypes.arrayOf(PropTypes.shape({
    //   action: PropTypes.string.isRequired,
    //   endpoint: PropTypes.string.isRequired,
    //   label: PropTypes.string.isRequired,
    //   onComplete: PropTypes.func,
    // })),
    // clearFilters: PropTypes.func.isRequired,
    // columnsConfigurable: PropTypes.bool.isRequired,
    // extraFilters: PropTypes.array,
    // filters: PropTypes.object,
    // globalActions: PropTypes.array,
    // hasListConfig: PropTypes.bool.isRequired,
    // manageColumns: PropTypes.func.isRequired,
    // mode: PropTypes.string,
    // performBatchAction: PropTypes.func.isRequired,
    // performGlobalAction: PropTypes.func.isRequired,
    // searchTerm: PropTypes.string,
    // setFilterValue: PropTypes.func.isRequired,
    // setSearchTerm: PropTypes.func.isRequired,
    // switchMode: PropTypes.func.isRequired,
  }

  render () {
    // const {
    //   columnsConfigurable,
    //   extraFilters,
    //   filters,
    //   globalActions,
    //   hasListConfig,
    //   mode,
    //   searchTerm,
    // } = this.props

    return (
      <div className='content__sidebar'>
        <form action='' className='form--animate'>
          <fieldset>
            <legend>Filter</legend>
            <div className='form__row'>
              <div className='form__group'>
                <label className='form__label'>Job number</label>
                <div className='form__control form__control--input'>
                  <input type='text' name='first_name' placeholder='Frank Green' />
                </div>
                <div className='form__help' />
              </div>
            </div>
            <div className='form__row'>
              <div className='form__group'>
                <label className='form__label'>Status</label>
                <div className='form__control form__control--select'>
                  <select className='form__select'>
                    <option className='' />
                    <option className='A'>Active</option>
                    <option className='B'>Archived</option>
                    <option className='C'>Pending</option>
                  </select>
                </div>
                <div className='form__help' />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    )
  }
}
