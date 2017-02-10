import axios from 'axios'


export function getworksData(id,limit){
	return axios.get(`/member/getWorks?id=${id}&limit=${limit}`)
}

export function submitPhotos(fd){
	return axios.post("/member/submitPhotos",fd)
}


