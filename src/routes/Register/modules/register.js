import axios from 'axios'
import {tipResult} from '../../../components/Tips/modules/tips'
// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_REGISTER = 'RECEIVE_REGISTER'
const REQUEST_REGISTER = 'REQUEST_REGISTER'
// const CLEAR_REGISTER = 'CLEAR_REGISTER'

// ------------------------------------
// Actions
// ------------------------------------

function requestREGISTER () {
  return {
    type: REQUEST_REGISTER
  }
}

let avaliableId = 0
export const receiveREGISTER = (value) => ({
  type: RECEIVE_REGISTER,
  payload: {
    text: value,
    id: avaliableId++
  }
})

// export const clearREGISTER = () => ({
//   type: CLEAR_REGISTER
// })

export function fetchRegister (items,router) {
  return (dispatch, getState) => {
    // if (getState().register.fetching) return
      dispatch(requestREGISTER())
    axios.post('/register',items).then(({data}) => {
      if (data=="success") {
          dispatch(tipResult({type:"success",msg:"注册成功"}))
          router.push('/login')
      }else{
          dispatch(tipResult({type:"error",msg:data}))
      }

    })
  }
}

// export const actions = {
//   requestREGISTER,
//   receiveREGISTER,
//   fetchRegister
// }

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_REGISTER]: (state) => {
    return ({...state, fetching: true})
  },
  [RECEIVE_REGISTER]: (state, action) => {
    return ({...state, fetching: false, text: state.text.concat(action.payload)})
  },
  // [CLEAR_REGISTER]: (state) => {
  //   return ({...state, text: []})
  // }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  fetching: false,
  text: []
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
