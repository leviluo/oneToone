import axios from 'axios'
import {tipResult} from '../components/Tips/modules/tips'
// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_LOGIN = 'REQUEST_LOGIN'
const AUTHIN = 'AUTHIN'
const AUTHOUT = 'AUTHOUT'
const MODIFYNICKNAME = 'MODIFYNICKNAME'
// const CLEAR_LOGIN = 'CLEAR_LOGIN'

// ------------------------------------
// Actions
// ------------------------------------

function requestLOGIN () {
  return {
    type: REQUEST_LOGIN
  }
}


function authIn (nickname,phone,memberId) {
  return {
    type: AUTHIN,
    nickname: nickname,
    phone:phone,
    memberId:memberId,
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
      if (data.status == 200) {
        // localStorage.setItem("nickname",data.nickname)
        dispatch(authIn(data.nickname,data.phone,data.memberId));
      } else{
        // localStorage.setItem("nickname",data.nickname)
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
      if (data.status == 200) {
          // localStorage.setItem("nickname",data.nickname)
          dispatch(authIn(data.nickname,items.phone,data.memberId));
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
      if (data.status == 200) {
      // localStorage.removeItem("nickname")
      dispatch(authOut())
      history.push('/')
      }
    })
  }
}

export function modifyNickname (newName) {
  return (dispatch, getState) => {
      dispatch({type:MODIFYNICKNAME,nickname:newName})
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
    return({...state,isAuth: true,nickname:action.nickname,phone:action.phone,memberId:action.memberId})
  },
  [AUTHOUT]:(state)=>{
    return({...state,isAuth: false,nickname:'',phone:'',memberId:''})
  },
  [MODIFYNICKNAME]:(state,action)=>{
    return({...state,nickname:action.nickname})
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
  nickname:'',
  phone:'',
  memberId:''
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
