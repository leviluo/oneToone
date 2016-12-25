import { injectReducer } from '../../store/reducers'

const requireAUTH = (nextState, replace, next) => {
    // if (localStorage.getItem('id_token') && (localStorage.getItem("role")==1)) {
    //     next()
    //     return
    // }
    console.log(nextState)
    replace({ pathname: '/login' })
    next()
}

export default (store) => ({
    path: 'memberCenter',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const memberCenter = require('./containers/memberCenter').default
            const reducer = require('./modules').default
            injectReducer(store, { key: 'myspecialities', reducer })
            cb(null, memberCenter)
        })
    },
    // onEnter: function(nextState, replace, next) {
    	// console.log(document.cookie)
    	// console.log(store.getState().auth)
        // if (store.getState().auth.isAuth) {
            // next()
        // } else {
        //     replace({ pathname: '/login' })
        //     next()
        // }
    // }
})
