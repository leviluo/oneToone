
// ------------------------------------
// Constants
// ------------------------------------
const IMGBROWSER_SHOW = 'IMGBROWSER_SHOW'

// ------------------------------------
// Actions
// ------------------------------------

export function imgbrowser(text) {
  return (dispatch, getState) => {
      dispatch({type:IMGBROWSER_SHOW,text:text})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [IMGBROWSER_SHOW]: (state, action) => {
    return ({...state, isShow:true,currentChoose:action.text.currentChoose,imgs:action.text.imgs,likeFunc:action.text.likeFunc})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
  currentChoose:0,
  imgs:[],
  likeFunc:null
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
