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
	    axios.get('/member/getMemberInfo').then(({data}) => {
	      if (data.status==200) {
	      	console.log(data)
	          return Promise.resolve(data.data)
	      }else{
	          dispatch(tipResult({type:"error",msg:data.msg}))
	          return Promise.reject(data.msg)
	      }
	    })
}
