// import { injectReducer } from '../../store/reducers'
import basic from './components/BasicInfo'
import speciality from './components/Speciality'


export default (store) => ({
    path: 'memberCenter',
    indexRoute: basic(store),
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const memberCenter = require('./containers/memberCenter').default
            cb(null, memberCenter)
        })
    },
    childRoutes:[
        speciality(store)
    ]
})
