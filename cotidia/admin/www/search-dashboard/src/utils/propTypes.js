import PropTypes from 'prop-types'

const batchAction = PropTypes.shape({
  action: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
})

const batchActions = PropTypes.arrayOf(batchAction)

const listHandling = PropTypes.shape({
  style: PropTypes.oneOf(['string', 'element']).isRequired,
  value: PropTypes.string.isRequired,
  props: PropTypes.object,
})

const column = PropTypes.shape({
  display: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.array,
  ]),
  filter: PropTypes.oneOf(['text', 'choice', 'boolean', 'number', 'date']),
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })),
  orderable: PropTypes.bool,
  listHandling,
  editable: PropTypes.bool,
  editURL: PropTypes.string,
})

const columns = PropTypes.objectOf(column)

const config = PropTypes.shape({
  dateFormat: PropTypes.string,
  datetimeFormat: PropTypes.string,
  primaryColor: PropTypes.string,
  columnsConfigurable: PropTypes.boolean,
  listHandling,
})

const categoriseBy = PropTypes.shape({
  column: PropTypes.string.isRequired,
  display: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
})

const globalAction = PropTypes.shape({
  action: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
})

const globalActions = PropTypes.arrayOf(globalAction)

const listFields = PropTypes.shape({
  left: PropTypes.shape({
    top: PropTypes.string,
    bottom: PropTypes.string,
  }),
  right: PropTypes.shape({
    top: PropTypes.string,
    bottom: PropTypes.string,
  }),
})

const extraFilter = PropTypes.shape({
  label: PropTypes.string.isRequired,
  field: PropTypes.string, // the field to send in the query
  type: PropTypes.oneOf(['boolean']),
})

const extraFilters = PropTypes.arrayOf(extraFilter)

export const appPropTypes = {
  authToken: PropTypes.string.isRequired,
  batchActions,
  columns: columns.isRequired,
  config,
  categoriseBy,
  globalActions,
  defaultColumns: PropTypes.arrayOf(PropTypes.string),
  listFields,
  defaultFilters: PropTypes.object,
  defaultOrderBy: PropTypes.string,
  extraFilters,
  detailURL: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  overrideStoredConfig: PropTypes.bool,
}
