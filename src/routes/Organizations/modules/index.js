import axios from 'axios'

export function OrganizationsSortByHot(id) {
      return axios.get('/organizations/OrganizationsSortByHot')
}

export function getUpdates(limit,location){ 
	return axios.get(`/public/getArticleUpdates?limit=${limit}&location=${location}`)
}