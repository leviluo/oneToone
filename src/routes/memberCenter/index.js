// import { injectReducer } from '../../store/reducers'
import basic from './routes/BasicInfo'
import speciality from './routes/Speciality'
import myteam from './routes/Myteam'
import mymessage from './routes/Mymessage'


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
        speciality(store),
        myteam(store),
        mymessage(store),
    ]
})
