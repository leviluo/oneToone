// var fs = require('fs')
// var path = require('path')

// function imageGet(fileurl) {
//     return new Promise(function(resolve, reject) {
//         fs.readFile(fileurl, 'binary', function(err, data) {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }

const fileController = {
    // imageQuery: async function(next) {
    //     console.log(this)
    //     var fileurl = path.resolve(__dirname, '../images/' + this.query.image)
    //     // var _this = this; 
    //     var result = await imageGet(fileurl)
    //     // this.response.header = { "Content-Type": "image/png" };
    //     this.response.body.pipe = result
    //     console.log(this)
    //     // console.log(await imageGet(fileurl))
    //     return next
    //         // this.render()
    // },
    // fileDownload: async function(next) {

    // }
    uploadHeadImg:function(next){
        console.log(this)
        // console.log(this.req)
        console.log(this.req.files)
    }
}

export default fileController
