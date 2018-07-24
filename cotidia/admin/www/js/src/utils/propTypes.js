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
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
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
  allowWrap: PropTypes.bool,
  maxWidth: PropTypes.number,
  options,
  orderable: PropTypes.bool,
  listHandling,
  editable: PropTypes.bool,
  editEndpoint: PropTypes.string,
  afterEdit: PropTypes.func,
})

const columns = PropTypes.objectOf(column)

const config = PropTypes.shape({
  columnsConfigurable: PropTypes.boolean,
  dateFormat: PropTypes.string,
  datetimeFormat: PropTypes.string,
  listHandling,
  primaryColor: PropTypes.string,
  sidebarStartsShown: PropTypes.boolean,
  weekDayStart: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
})

const extraFilter = PropTypes.shape({
  label: PropTypes.string.isRequired,
  filter: PropTypes.oneOf(['boolean', 'text', 'number', 'date', 'choice']),
  options,
})

const extraFilters = PropTypes.objectOf(extraFilter)

const globalAction = PropTypes.shape({
  action: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  classes: PropTypes.string,
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

export const dynamicListPropTypes = {
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
  ignoreStoredConfig: PropTypes.bool,
  listFields,
  sidebarFilters: stringList,
  title: PropTypes.string.isRequired,
  toolbarFilters: stringList,
}
