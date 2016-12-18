
// ------------------------------------
// Constants
// ------------------------------------
const MODAL_STATUS = 'MODAL_STATUS'

// ------------------------------------
// Actions
// ------------------------------------

export function modal(text) {
  console.log(text)
  return (dispatch, getState) => {
      dispatch({type:MODAL_STATUS,status:text})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MODAL_STATUS]: (state, action) => {
    return ({...state, isShow:action.status})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
