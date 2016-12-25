import axios from 'axios'
import {tipResult} from '../../../components/Tips/modules/tips'
// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_LOGIN = 'REQUEST_LOGIN'
const AUTHIN = 'AUTHIN'
const AUTHOUT = 'AUTHOUT'
// const CLEAR_LOGIN = 'CLEAR_LOGIN'

// ------------------------------------
// Actions
// ------------------------------------

function requestLOGIN () {
  return {
    type: REQUEST_LOGIN
  }
}


function authIn (nickname) {
  return {
    type: AUTHIN,
    nickname: nickname
  }
}

function authOut () {
  return {
    type: AUTHOUT
  }
}

export function isAuth(history) {
  return (dispatch, getState) => {
    axios.get('/auth').then(({data}) => {
      if (data.status == "success") {
        // localStorage.setItem("nickname",data.nickname)
        dispatch(authIn(data.nickname));
      } else{
        // localStorage.setItem("nickname",data.nickname)
        console.log(history)
        if (history) {
           history.push('/login')
        }
      }
    })
  }
}


export function login(items,history) {
  return (dispatch, getState) => {
    dispatch(requestLOGIN())
    axios.post('/login',items).then(({data}) => {
      if (data.status == "success") {
          // localStorage.setItem("nickname",data.nickname)
          dispatch(authIn(data.nickname));
          history.push('/memberCenter')
      }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}

export function loginOut (history) {
  return (dispatch, getState) => {
    axios.get('/loginOut').then(({data}) => {
      if (data.status == "success") {
      // localStorage.removeItem("nickname")
      dispatch(authOut())
      history.push('/')
      }
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_LOGIN]: (state) => {
    return ({...state, fetching: true})
  },
  [AUTHIN]:(state,action)=>{
    return({...state,isAuth: true,nickname:action.nickname})
  },
  [AUTHOUT]:(state)=>{
    return({...state,isAuth: false})
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
//var isAuth = localStorage.getItem('token') ? true : false
//console.log(isAuth)
export const initialState = {
  fetching: false,
  isAuth: false,
  nickname:''
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
