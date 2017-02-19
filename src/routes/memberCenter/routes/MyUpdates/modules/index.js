import axios from 'axios'

export function getMyUpdates(id,limit){
	return axios.get(`/public/getMyUpdates?id=${id}&limit=${limit}`)
}


