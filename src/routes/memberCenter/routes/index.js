// import { injectReducer } from '../../store/reducers'

export default (store) => ({
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const basicInfo = require('./basicInfo').default
            // const reducer = require('./modules').default
            // injectReducer(store, { key: 'myspecialities', reducer })
            cb(null, basicInfo)
        })
    },
})
