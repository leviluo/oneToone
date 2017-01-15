// import { injectReducer } from '../../store/reducers'

export default (store) => ({
	path:"/memberCenter/myTeam",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myTeam = require('./myTeam').default
            // var reducer = require('./modules').default
            // injectReducer(store, { key: 'myspecialities', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, myTeam)
        })
    },
})