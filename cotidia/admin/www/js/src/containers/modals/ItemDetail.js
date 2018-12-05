import { connect } from 'react-redux'

import ItemDetail from '../../components/modals/ItemDetail'

const mapStateToProps = (state, ownProps) => ({
  componentReference: state.config.detailConfig?.modalComponentReference,
  componentProps: state.config.detailConfig?.modalComponentProps,
})

export default connect(mapStateToProps)(ItemDetail)
