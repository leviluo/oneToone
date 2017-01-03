var multiparty = require('multiparty')
var fs  = require('fs')
import { sqlStr } from '../dbHelps/mysql'

function getImage(url){
    return new Promise(function(reslove,reject){
     fs.readFile(url, "binary", function(error, file) {
            if (error) {
                reject(error)
            } else {
                reslove(file)
            }
        });
    })
}

function form(ob,user){
    return new Promise(function(reslove,reject){
          var form = new multiparty.Form({ uploadDir: './server/upload/headImages/' });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                 var filesTmp = JSON.stringify(files, null, 2);
                if (err) {
                    reject(err)
                } else {
                            var inputFile = files.file[0];
                            var uploadedPath = inputFile.path;
                            var dstPath = './server/upload/headImages/' + user + '.jpg';
                    //       //重命名为真实文件名
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if (err) {
                                    reject(err)
                                } else {
                                    reslove("success")
                                }   
                            })
                }
            })
    })
}



const fileController = {
    loadHeadImg:async function(next){
        var user = this.session.user
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        var url = './server/upload/headImages/' + user + '.jpg';
        var result = await getImage(url);
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(result, "binary");
        this.res.end();
    },
    uploadHeadImg:async function(next){
        // console.log(this.request)
        var user = this.session.user
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        var result = await form(this.req,user)
        if (result == 'success') {
            // var resultt = await sqlStr(`update member set head = '${dstPath}' where phone = ${user}`)
            this.body = {status:'success'}
        }
    }
}

export default fileController
