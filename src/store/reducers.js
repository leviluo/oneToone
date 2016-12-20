import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

// Fix: "React-Redux: Combining reducers: Unexpected Keys"
// http://stackoverflow.com/a/33678198/789076
const initialReducers = {
  counter: (state = 0) => state,
  zen: (state = require('../routes/Zen/modules/zen').initialState) => state,
  mytips: (state = require('../components/Tips/modules/tips').initialState) => state,
  modal: (state = require('../components/Modal/modules/modal').initialState) => state,
  mylocation: (state = require('../components/Location/modules/location').initialState) => state,
  auth: (state = require('../components/Header/modules/auth').initialState) => state,
}


export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    router,
    ...initialReducers,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
