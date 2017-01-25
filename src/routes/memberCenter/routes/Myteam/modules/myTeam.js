import axios from 'axios'

export function addOrganization(fd){
	return axios.post('/member/addOrganization',fd)
}

export function modifyOrganization(fd){
	return axios.post('/member/modifyOrganization',fd)
}

export function deleteOrganization(id){
	return axios.post('/member/deleteOrganization',{id:id})
}

export function getOrganizationByMe(fd){
	return axios.get('/member/getOrganizationByMe')
}

export function getCatelogy(){
	return axios.get('/public/getCatelogy')
}