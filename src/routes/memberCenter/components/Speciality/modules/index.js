import axios from 'axios'
import {tipResult} from '../../../../../components/Tips/modules/tips'
import {modal} from '../../../../../components/Modal/modules/modal'

export function addSpeciatity (items) {
  return (dispatch, getState) => {
    axios.post('/member/addSpeciality',items).then(({data}) => {
      if (data.status==200) {
          // dispatch(tipResult({type:"success",msg:"添加成功"}))
          dispatch({type:"MODAL_STATUS",status:false})
      	  dispatch({type:"RECEIVE_SPECIALITIES",value:[items]})
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
    return ({...state, text: state.text.concat(action.value),isloaded:true})
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

