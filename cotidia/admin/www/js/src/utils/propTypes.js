import PropTypes from 'prop-types'

const requiredIf = (field, value, propType) => (props, prop, component) => {
  let required = false

  if (Array.isArray(value)) {
    required = value.includes(props[field])
  } else {
    required = props[field] === value
  }

  if (required) {
    return PropTypes.checkPropTypes({ [prop]: propType.isRequired }, props, 'prop', component)
  } else {
    return PropTypes.checkPropTypes({ [prop]: propType }, props, 'prop', component)
  }
}

const stringList = PropTypes.arrayOf(PropTypes.string)

export const option = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
})

export const options = PropTypes.arrayOf(option)

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
  display: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
})

const columnConfigSingle = PropTypes.shape({
  display: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.array]),
  filter: PropTypes.string,
  label: PropTypes.string.isRequired,
  allowWrap: PropTypes.bool,
  maxWidth: PropTypes.number,
  orderable: PropTypes.bool,
  listHandling,
  editConfiguration: PropTypes.shape({
    endpoint: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: requiredIf('type', ['choice', 'choice-single'], options),
    onComplete: PropTypes.func,
  }),
})

const columnConfiguration = PropTypes.objectOf(columnConfigSingle)

const columnCategory = PropTypes.shape({
  label: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
})

const columns = PropTypes.arrayOf(columnCategory)

const config = PropTypes.shape({
  columnsConfigurable: PropTypes.boolean,
  dateFormat: PropTypes.string,
  datetimeFormat: PropTypes.string,
  detailURLField: PropTypes.string,
  filterTagBarVisible: PropTypes.bool,
  listHandling,
  primaryColor: PropTypes.string,
  searchVisible: PropTypes.bool,
  sidebarStartsShown: PropTypes.boolean,
  weekDayStart: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
})

const algoliaConfig = PropTypes.shape({
  appId: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  indexes: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.arrayOf(PropTypes.string),
})

export const suggestConfiguration = PropTypes.shape({
  algoliaConfig: requiredIf('mode', 'algolia', algoliaConfig),
  endpoint: requiredIf('mode', 'api', PropTypes.string),
  mode: PropTypes.oneOf(['algolia', 'api', 'options']).isRequired,
  options: requiredIf('mode', 'options', options),
})

const filterType = PropTypes.oneOf(['text', 'choice', 'choice-single', 'boolean', 'number', 'date'])

const filterConfigSingle = PropTypes.shape({
  label: PropTypes.string.isRequired,
  filter: filterType,
  configuration: requiredIf('filter', ['choice', 'choice-single'], suggestConfiguration),
})

export const filterConfiguration = PropTypes.objectOf(filterConfigSingle)

const filterList = PropTypes.oneOfType([
  stringList,
  PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      defaultOpen: PropTypes.bool,
      filters: stringList,
    })
  ),
])

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

const resultsMode = PropTypes.oneOf([
  'list',
  'map',
  'table',
])

export const dynamicListPropTypes = {
  allowedResultsModes: PropTypes.arrayOf(resultsMode),
  authToken: PropTypes.string.isRequired,
  batchActions,
  columnConfiguration: columnConfiguration.isRequired,
  columns: columns.isRequired,
  config,
  categoriseBy,
  defaultColumns: stringList,
  defaultFilters: PropTypes.object,
  defaultOrderBy: PropTypes.string,
  defaultPerPage: PropTypes.number,
  defaultResultsMode: resultsMode,
  endpoint: PropTypes.string.isRequired,
  filterConfiguration,
  filterSuggestConfiguration: suggestConfiguration,
  globalActions,
  ignoreStoredConfig: PropTypes.bool,
  listFields,
  mapConfiguration: PropTypes.shape({
    defaultCoords: PropTypes.arrayOf(PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })),
    marker: PropTypes.shape({
      labelField: PropTypes.string.isRequired,
      backgroundField: PropTypes.string.isRequired,
      foregroundField: PropTypes.string.isRequired,
    }),
  }),
  sidebarFilters: filterList,
  title: PropTypes.string,
  toolbarFilters: filterList,
}
