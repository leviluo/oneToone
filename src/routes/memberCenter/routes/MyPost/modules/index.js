import axios from 'axios'


export function getMyPost(){
	return axios.get('/organizations/getMyPost')
}

