
// ------------------------------------
// Constants
// ------------------------------------
const MODAL_SHOW = 'MODAL_SHOW'
const MODAL_HIDE = 'MODAL_HIDE'

// ------------------------------------
// Actions
// ------------------------------------

export function modalShow(text) {
  return (dispatch, getState) => {
      dispatch({type:MODAL_SHOW,text:text})
  }
}

export function modalHide() {
  return (dispatch, getState) => {
      dispatch({type:MODAL_HIDE})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MODAL_SHOW]: (state, action) => {
    return ({...state, isShow:true,header:action.text.header,content:action.text.content,submit:action.text.submit})
  },
  [MODAL_HIDE]: (state, action) => {
    return ({...state, isShow:false,header:'',content:'',submit:null})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
  header:'',
  content:'',
  submit:null
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
