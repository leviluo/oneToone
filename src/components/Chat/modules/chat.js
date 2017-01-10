
// ------------------------------------
// Constants
// ------------------------------------
const CHAT_STATUS = 'CHAT_STATUS'

// ------------------------------------
// Actions
// ------------------------------------

export function chat(text) {
  return (dispatch, getState) => {
      dispatch({type:CHAT_STATUS,status:text})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CHAT_STATUS]: (state, action) => {
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
