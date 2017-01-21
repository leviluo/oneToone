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


export function modifySpeciality(that,speciality,brief,experience) {
      var fd = new FormData(); 
      var works = ''
      for (var i = 0; i < that.state.modifyImgs.length; i++) {
        if(that.state.modifyImgs[i].file){
          fd.append("file", that.state.modifyImgs[i].file); 
        }else{
          works += that.state.modifyImgs[i].key+','
        }
      }
      fd.append("speciality",speciality)
      fd.append("brief",brief)
      fd.append("experience",experience)
      fd.append("works",works.slice(0,-1))
      return axios.post('/member/modifySpeciality',fd)
}

export function deleteSpeciality(item) {
	    return axios.post('/member/deleteSpeciality',item)
}

export function addSpeciatity (that,speciality,brief,experience) {
  var fd = new FormData(); 
  for (var i = 0; i < that.state.imgs.length; i++) {
  fd.append("file", that.state.imgs[i]); 
  }
  fd.append("speciality",speciality)
  fd.append("brief",brief)
  fd.append("experience",experience)
  return (dispatch, getState) => {
    axios.post('/member/addSpeciality',fd).then(({data}) => {
      if (data.status==200) {
          that.setState({showAddSpeciality:false})
          // dispatch({type:"ADD_SPECIALITIES",value:[{speciality:speciality,brief:brief,experience:experience}]})
          that.props.fetchSpeciality()
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

export function updateSpeciality (data) {
  return (dispatch, getState) => {
      dispatch(receiveSpeciality(data))
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

