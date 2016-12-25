import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/speciality",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const speciality = require('./speciality').default
            const reducer = require('./modules').default
            injectReducer(store, { key: 'myspecialities', reducer })
            cb(null, speciality)
        })
    },
})
