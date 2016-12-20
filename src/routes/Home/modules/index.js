import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_CATEGOIES = 'RECEIVE_CATEGOIES'
// ------------------------------------
// Actions
// ------------------------------------

export const receiveCategoy = (value) => ({
  type: RECEIVE_CATEGOIES,
  value: value,
})

export function fetchCategoies () {
  return (dispatch, getState) => {
    axios.get('/public/categoies').then(({data}) => {
      dispatch(receiveCategoy(data))
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_CATEGOIES]: (state, action) => {
    return ({...state, text: action.value})
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
