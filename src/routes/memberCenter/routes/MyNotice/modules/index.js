import axios from 'axios'


export function getmyNotice(){
	return axios.get('/organizations/getmyNotice')
}

