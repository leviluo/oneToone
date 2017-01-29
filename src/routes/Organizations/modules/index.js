import axios from 'axios'

export function OrganizationsSortByHot(id) {
      return axios.get('/organizations/OrganizationsSortByHot')
}

