import axios from 'axios'


export function getworksData(id,limit){
	return axios.get(`/organizations/getrequestData?id=${id}&limit=${limit}`)
}

export function submitPhotos(fd){
	return axios.post("/organizations/submitPhotos",fd)
}


