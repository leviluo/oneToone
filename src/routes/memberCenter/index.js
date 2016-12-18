import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'memberCenter',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const memberCenter = require('./containers/memberCenter').default
      const reducer = null
      injectReducer(store, { key: 'memberCenter', reducer })
      cb(null, memberCenter)
    })
  }
})
