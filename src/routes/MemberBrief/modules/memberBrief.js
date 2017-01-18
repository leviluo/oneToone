import axios from 'axios'

export function getSpecialities(phone) {
	return axios.get('/member/specialities?phone='+phone)
}
