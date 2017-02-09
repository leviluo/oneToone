// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/photos/:id",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const photos = require('./photos').default
            // var reducer = require('./modules/photos').default
            // injectReducer(store, { key: 'photos', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, photos)
        })
    },
})