import PropTypes from 'prop-types'

const stringList = PropTypes.arrayOf(PropTypes.string)

const option = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
})

const options = PropTypes.arrayOf(option)

const listHandling = PropTypes.shape({
  style: PropTypes.oneOf(['string', 'element']).isRequired,
  value: PropTypes.string.isRequired,
  props: PropTypes.object,
})

// ---

const batchAction = PropTypes.shape({
  action: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
})

const batchActions = PropTypes.arrayOf(batchAction)

const categoriseBy = PropTypes.shape({
  column: PropTypes.string.isRequired,
  display: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
})

const column = PropTypes.shape({
  display: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.array,
  ]),
  filter: PropTypes.oneOf(['text', 'choice', 'boolean', 'number', 'date']),
  label: PropTypes.string.isRequired,
  options,
  orderable: PropTypes.bool,
  listHandling,
  editable: PropTypes.bool,
  editURL: PropTypes.string,
})

const columns = PropTypes.objectOf(column)

const config = PropTypes.shape({
  columnsConfigurable: PropTypes.boolean,
  dateFormat: PropTypes.string,
  datetimeFormat: PropTypes.string,
  listHandling,
  primaryColor: PropTypes.string,
})

const extraFilter = PropTypes.shape({
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['boolean', 'text', 'number', 'date', 'choice']),
  options,
})

const extraFilters = PropTypes.objectOf(extraFilter)

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

export const appPropTypes = {
  authToken: PropTypes.string.isRequired,
  batchActions,
  columns: columns.isRequired,
  config,
  categoriseBy,
  defaultColumns: stringList,
  defaultFilters: PropTypes.object,
  defaultOrderBy: PropTypes.string,
  detailURL: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  extraFilters,
  globalActions,
  listFields,
  overrideStoredConfig: PropTypes.bool,
  sidebarFilters: stringList,
  title: PropTypes.string.isRequired,
  toolbarFilters: stringList,
}
