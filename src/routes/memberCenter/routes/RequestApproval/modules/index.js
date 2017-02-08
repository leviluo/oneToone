import axios from 'axios'


export function getrequestData(limit){
	return axios.get(`/organizations/getrequestData?limit=${limit}`)
}

