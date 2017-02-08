import axios from 'axios'


export function getrequestData(id,limit){
	return axios.get(`/organizations/getrequestData?id=${id}&limit=${limit}`)
}

