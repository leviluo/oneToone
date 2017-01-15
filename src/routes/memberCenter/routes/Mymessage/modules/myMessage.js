import axios from 'axios'

export function messageList(){
	return axios.get("/member/getMessageList")
}