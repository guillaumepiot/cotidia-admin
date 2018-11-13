import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../../../utils/resultItems'

import EditBoolean from '../../fields/editors/Boolean'
import EditChoice from '../../fields/editors/Choice'
import EditChoiceSingle from '../../fields/editors/ChoiceSingle'
import EditDate from '../../fields/editors/Date'
import EditText from '../../fields/editors/Text'
import EditNumber from '../../fields/editors/Number'

import { Icon } from '../../elements/global'

// TODO: Look into PureComponent like we do in ResultsTableItem. But redux...?
export default class ResultsTableItemValue extends Component {
  static propTypes = {
    column: PropTypes.object.isRequired,
    config: PropTypes.object,
    editField: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  }

  state = {
    editing: false,
    value: null,
  }

  startEditing = () => this.setState({
    editing: true,
    value: this.props.item[this.props.column.accessor],
  })

  cancelEdit = () => this.setState({
    editing: false,
    value: null,
  })

  handleUpdateValue = (value) => {
    this.setState({ value })
  }

  saveEdit = () => {
    this.props.editField(this.props.item.uuid, this.props.column.accessor, this.state.value)
    this.setState({ editing: false })
  }

  render () {
    const {
      column,
      config,
      item,
    } = this.props

    const { editing } = this.state

    const formatValue = getValueFormatter(config)

    const formattedValue = formatValue(item, column.accessor, column.display, column.listHandling)

    if (column.editConfiguration?.endpoint) {
      let innerComponent = (
        <div className='table-cell-editable__value'>
          {formattedValue}
        </div>
      )

      if (editing) {
        const props = {
          config: this.props.config,
          name: column.accessor,
          updateValue: this.handleUpdateValue,
          value: this.state.value,
        }

        switch (column.editConfiguration.type) {
          case 'boolean':
            innerComponent = <EditBoolean {...props} />
            break
          case 'choice':
            innerComponent = <EditChoice {...props} options={column.editConfiguration.options} />
            break
          case 'choice-single':
            innerComponent = <EditChoiceSingle {...props} options={column.editConfiguration.options} />
            break
          case 'date':
            innerComponent = <EditDate {...props} />
            break
          case 'number':
            innerComponent = <EditNumber {...props} />
            break
          case 'text':
            innerComponent = <EditText {...props} />
            break
        }
      }

      return (
        <div className='table-cell-editable'>
          {innerComponent}
          {editing ? (
            <>
              <button
                className='table-cell-editable__action table-cell-editable__action--save'
                key='save'
                onClick={this.saveEdit}
                type='button'
              >
                <Icon icon='check' />
              </button>
              <button
                className='table-cell-editable__action table-cell-editable__action--cancel'
                key='cancel'
                onClick={this.cancelEdit}
                type='button'
              >
                <Icon icon='times' />
              </button>
            </>
          ) : (
            <button
              className='table-cell-editable__action table-cell-editable__action--edit'
              key='edit'
              onClick={this.startEditing}
              type='button'
            >
              <Icon icon='pen' />
            </button>
          )}
        </div>
      )
    }

    return formattedValue || null
  }
}
