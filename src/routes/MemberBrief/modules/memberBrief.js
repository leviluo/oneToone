import axios from 'axios'

export function getSpecialities(phone) {
	return axios.get('/member/specialities?phone='+phone)
}

export function memberInfo(phone) {
	return axios.get('/public/memberInfo?phone='+phone)
}
