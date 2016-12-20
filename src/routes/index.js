// We only need to import the modules necessary for initial render
import MyCoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import CounterRoute from './Counter'
import Zen from './Zen'
import Register from './Register'
import memberCenter from './memberCenter'
import Login from './Login'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: MyCoreLayout(store),
  indexRoute: Home(store),
  childRoutes: [
    CounterRoute(store),
    Zen(store),
    Register(store),
    memberCenter(store),
    Login(store),
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
