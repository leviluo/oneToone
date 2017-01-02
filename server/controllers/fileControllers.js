var multiparty = require('multiparty')
var fs  = require('fs')

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
        console.log(this.request)
         //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({ uploadDir: './server/upload/headImages/' });
        //上传完成后处理
        form.parse(this.req, function(err, fields, files) {
             var filesTmp = JSON.stringify(files, null, 2);
            if (err) {
                console.log('parse error: ' + err);
            } else {
                console.log(files)
                console.log(fields)
                // User.findOne({ _id: req.userid }, function(err, docs) {
                //     if (err) return next(err);
                //     if (docs) {
                        var inputFile = files.file[0];
                        var uploadedPath = inputFile.path;
                        var dstPath = './server/upload/headImages/' + inputFile.originalFilename + '.jpg';

                //         // Activity.findOne({ uuid: fields.uuid.toString() }, function(err, docs) {
                //         //     if (err) {
                //         //         console.log(err);
                //         //         return next(err);
                //         //     }
                //         //     console.log('信息保存成功');

                //         //重命名为真实文件名
                        fs.rename(uploadedPath, dstPath, function(err) {
                //             if (err) {
                //                 console.log('rename error: ' + err);
                //             } else {
                //                 Activity.update({ uuid: fields.uuid.toString() }, { $push: { images: dstPath } }, function(err, docs) {
                //                     if (err) {
                //                         console.log(err);
                //                         return next(err);
                //                     }
                //                     console.log('信息保存成功');
                //                 })
                //             }
                        });
                //         // })
                //     } else {
                //         return res.json({ 'id': -11, 'msg': '用户不存在' })
                //     }
                // })
            }

        })
    }
}

export default fileController
