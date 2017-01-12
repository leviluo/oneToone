import axios from 'axios'

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

//otherMethods
export function submitText(text,target,sendFrom){
  return (dispatch, getState) => {
    axios.post('/member/messageText',text).then(({data}) => {
      if (data.status==200) {
          var str = `<p class="sendFrom"><span>${text.text}</span>&nbsp;<span class="name">&nbsp;:&nbsp;${sendFrom}</span></p>`
          target.innerHTML += str; 
      }else{
          var str = `<p style="color:red">${data.msg}</p>`
          target.innerHTML += str; 
      }
    })
  }
}

export function submitImg(data,target,sendFrom,file){
  return (dispatch, getState) => {
    axios.post('/member/messageImg',data).then(({data}) => {
      if (data.status==200) {
            var reader = new FileReader();  
            reader.onload = function(e) {  
                var src = e.target.result + "";   
                var str = `<p class="sendFrom img"><img src="${src}"/>&nbsp;<span class="name">&nbsp;:&nbsp;${sendFrom}</span></p>`
                target.innerHTML += str; 
            }  
            reader.readAsDataURL(file);  

      }else{
          var str = `<p style="color:red">${data.msg}</p>`
          target.innerHTML += str; 
      }
    })
  }
}
