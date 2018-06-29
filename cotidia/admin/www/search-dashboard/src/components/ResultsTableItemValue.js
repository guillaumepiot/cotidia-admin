import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getValueFormatter } from '../utils/resultItems'

import EditBoolean from './editors/Boolean'
import EditChoice from './editors/Choice'
import EditDate from './editors/Date'
import EditText from './editors/Text'
import EditNumber from './editors/Number'

import { Icon } from './elements/global'

// TODO: Look into PureComponent like we do in ResultsTableItem
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

    if (column.editable) {
      let innerComponent = formattedValue

      if (editing) {
        const props = {
          name: column.accessor,
          updateValue: this.handleUpdateValue,
          value: this.state.value,
        }

        switch (column.filter) {
          case 'boolean':
            innerComponent = <EditBoolean {...props} />
            break
          case 'choice':
            innerComponent = <EditChoice {...props} options={column.options} />
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
        <div>
          {innerComponent}
          {editing ? (
            <>
              <button key='save' className='btn btn--small btn--primary' onClick={this.saveEdit}>
                <Icon icon='check-square' />
              </button>
              <button key='cancel' className='btn btn--small btn--delete' onClick={this.cancelEdit}>
                <Icon icon='trash-alt' />
              </button>
            </>
          ) : (
            <button key='edit' className='btn btn--small btn--change' onClick={this.startEditing}>
              <Icon icon='edit' />
            </button>
          )}
        </div>
      )
    }

    return formattedValue || null
  }
}
