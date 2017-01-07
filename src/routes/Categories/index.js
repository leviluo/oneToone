import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/categories/',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const categories = require('./containers/categories').default
      var reducer = require('./modules').default
      injectReducer(store, { key: 'items', reducer })
       reducer = require('../../reducers/category').default
      injectReducer(store, { key: 'catelogues', reducer })
      cb(null, categories)
    })
  }
})