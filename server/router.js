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
    // else if(ctx.req.url == '/'){
    //   axios.get('http://api.map.baidu.com/location/ip?ak=W6TiQkinV02e8UGbIPFqEZMzwWB3e797&coor=bd09ll').then(({data}) => {
    //     resolve({mylocation:{text:data}})
    //   })
    // }
    else {
      resolve({})
    }
  })
}
