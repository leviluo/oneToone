import axios from 'axios'
import {tipResult} from '../../../../../components/Tips/modules/tips'

export function commitHeadImg(items) {
  return (dispatch, getState) => {
    axios.post('/member/HeadImg',items).then(({data}) => {
      if (data.status==200) {
          document.getElementById('memberinfoHeadImg').src = '/member/Headload?'+new Date()
      }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}

export function getMemberInfo() {
      return axios.get('/member/getMemberInfo')
}


export function modifyNickname(item) {
      return axios.post('/member/modifyNickname',item)
}


export function modifyAddress(item) {
      return axios.post('/member/modifyAddress',item)
}


export function modifySpeciality(item) {
	    return axios.post('/member/modifySpeciality',item)
}

export function addSpeciatity (items) {
  return (dispatch, getState) => {
    axios.post('/member/addSpeciality',items).then(({data}) => {
      if (data.status==200) {
          dispatch({type:"MODAL_HIDE"})
          dispatch({type:"ADD_SPECIALITIES",value:[items]})
      }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_SPECIALITIES = 'RECEIVE_SPECIALITIES'
const ADD_SPECIALITIES = 'ADD_SPECIALITIES'
// ------------------------------------
// Actions
// ------------------------------------

export const receiveSpeciality = (value) => ({
  type: RECEIVE_SPECIALITIES,
  value: value,
})

export function fetchSpeciality () {
  return (dispatch, getState) => {
    axios.get('/member/specialities').then(({data}) => {
      dispatch(receiveSpeciality(data.data))
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_SPECIALITIES]: (state, action) => {
    return ({...state, text: action.value,isloaded:true})
  },
  [ADD_SPECIALITIES]: (state, action) => {
    return ({...state, text: state.text.concat(action.value)})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  text: []
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

