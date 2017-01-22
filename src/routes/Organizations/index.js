// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/Organization',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const organization = require('./organization').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, organization)
    })
  }
})
