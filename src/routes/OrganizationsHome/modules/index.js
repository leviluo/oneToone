import axios from 'axios'

export function getBasicInfo(id) {
      return axios.get('/organizations/basicInfo?id='+id)
}

// export function modifyNickname(item) {
//       return axios.post('/member/modifyNickname',item)
// }

// export function modifyAddress(item) {
//       return axios.post('/member/modifyAddress',item)
// }




// // ------------------------------------
// // Constants
// // ------------------------------------
// const RECEIVE_SPECIALITIES = 'RECEIVE_SPECIALITIES'
// const ADD_SPECIALITIES = 'ADD_SPECIALITIES'
// // ------------------------------------
// // Actions
// // ------------------------------------

// export const receiveSpeciality = (value) => ({
//   type: RECEIVE_SPECIALITIES,
//   value: value,
// })

// export function fetchSpeciality () {
//   return (dispatch, getState) => {
//     axios.get('/member/specialities').then(({data}) => {
//       dispatch(receiveSpeciality(data.data))
//       })
//   }
// }

// export function updateSpeciality (data) {
//   return (dispatch, getState) => {
//       dispatch(receiveSpeciality(data))
//   }
// }

// // ------------------------------------
// // Action Handlers
// // ------------------------------------
// const ACTION_HANDLERS = {
//   [RECEIVE_SPECIALITIES]: (state, action) => {
//     return ({...state, text: action.value,isloaded:true})
//   },
//   [ADD_SPECIALITIES]: (state, action) => {
//     return ({...state, text: state.text.concat(action.value)})
//   }
// }

// // ------------------------------------
// // Reducer
// // ------------------------------------
// export const initialState = {
//   text: []
// }

// export default function (state = initialState, action) {
//   const handler = ACTION_HANDLERS[action.type]

//   return handler ? handler(state, action) : state
// }

