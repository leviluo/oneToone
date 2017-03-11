import axios from 'axios'

export function OrganizationsSortByHot(id) {
      return axios.get('/organizations/OrganizationsSortByHot')
}

export function getUpdates(limit,location){ 
	return axios.get(`/public/getTitleUpdates?limit=${limit}&location=${location}`)
}