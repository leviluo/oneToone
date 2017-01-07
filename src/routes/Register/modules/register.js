import axios from 'axios'
import {tipResult} from '../../../components/Tips/modules/tips'
// import {login} from '../../../components/Header/modules/auth'

export function fetchRegister (items,history) {
  return (dispatch, getState) => {
    axios.post('/register',items).then(({data}) => {
      if (data.status==200) {
          dispatch(tipResult({type:"success",msg:"注册成功,3S后自动跳转登录页面"}))
          setTimeout(()=>{
            history.push('/login')
          },3000)
      }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}
