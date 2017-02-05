// import { injectReducer } from '../../store/reducers'
import basic from './routes/BasicInfo'
import myCreateTeam from './routes/MyCreateTeam'
import myAttendTeam from './routes/MyAttendTeam'
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
        myAttendTeam(store),
        myCreateTeam(store),
        mymessage(store),
    ]
})
