import axios from 'axios'

export function getMyUpdates(){
	return axios.get('/member/getMyUpdates')
}


