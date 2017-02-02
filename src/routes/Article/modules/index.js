import axios from 'axios'

// 基本信息
export function getArticle(id) {
      return axios.get('/organizations/article?id='+id)
}