import axios from 'axios'

export default async function (ctx) {
  return new Promise((resolve, reject) => {
    //根据访问路由的刷新时判断需要初始化数据
    // console.log(ctx.req.url)
    if (ctx.req.url == '/zen') {
      axios.get('https://api.github.com/zen').then(({data}) => {
        resolve({zen: { text: [{text: data}]} })
      })
    } 
    else if(ctx.req.url == '/'){
      axios.get('http://localhost:3000/public/categoies').then(({data}) => {
        console.log(data)
        resolve({categories:{text:data}})
      })
    }
    else {
      resolve({})
    }
  })
}
