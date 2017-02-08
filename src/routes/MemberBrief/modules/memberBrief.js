import axios from 'axios'

export function getSpecialities(id) {
	return axios.get('/member/specialities?id='+id)
}

export function memberInfo(id) {
	return axios.get('/public/memberInfo?id='+id)
}
