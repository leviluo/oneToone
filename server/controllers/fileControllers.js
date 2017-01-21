var multiparty = require('multiparty')
var fs  = require('fs')
import { sqlStr } from '../dbHelps/mysql'
import config from '../config'
// var gm = require('gm');
// var gm = require('gm').subClass({imageMagick: true});

function getImage(url,defaultImg){
    return new Promise(function(reslove,reject){
        fs.exists(url, function (exists) {
                    if (exists) {
                        var file = url
                    }else{
                        var file = defaultImg
                    }
         fs.readFile(file, "binary", function(error, file) {
                if (error) {
                    reject(error)
                } else {
                    reslove(file)
                }
            });
        })
   }) 
}

function form(ob,user,url){
    return new Promise(function(reslove,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {
                            var inputFile = files.file[0];
                            var uploadedPath = inputFile.path;
                            var dstPath = url + user + '.jpg';
                           //重命名为真实文件名
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if (err) {
                                    reject({status:500,type:err})
                                } else {
                                    reslove({status:200,msg:fields})
                                }   
                            })
                }
            })
    })
}

function uploadImgs(ob,name,url){
    return new Promise(function(reslove,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {    
                        fields.names=[]
                        if (files.file) {
                            for (var i = 0; i < files.file.length; i++) {
                                var inputFile = files.file[i]
                                var uploadedPath = inputFile.path;
                                var dstPath = url + name + Date.parse(new Date())+ i + '.jpg';
                                fields.names.push(name + Date.parse(new Date())+ i)
                               //重命名为真实文件名
                                fs.rename(uploadedPath, dstPath, function(err) {
                                    if (err) {
                                        reject({status:500,type:err})
                                    } else {
                                    }   
                                })
                                // gm(dstPath)
                                // .resize(100, 100)
                                // .noProfile()
                                // .write('resize.png', function (err) {
                                //     console.log('00000000000000000000000')
                                //     console.log(err)
                                //   if (!err) console.log('done');
                                // });
                            }
                        };
                        reslove({status:200,msg:fields})
                }
            })
    })
}

const fileController = {
    loadImg:async function(next){
        if (this.request.query.from == 'chat') {
            var url = config.messageImgDir + this.request.query.name + '.jpg';
            var result = await getImage(url,config.messageImgDir + 'default.jpg');
        }else if(this.request.query.from == "speciality"){
            var url = config.specialityImgDir + this.request.query.name + '.jpg';
            var result = await getImage(url,config.specialityImgDir + 'default.jpg');
        }
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(result, "binary");
        this.res.end();
    },
    publicuploadHeadImg:async function(next){
        if (!this.request.query.member) {
            this.body = { status: "err", msg: "缺少参数" }
            return
        }
        var url = config.headDir + this.request.query.member + '.jpg';
        var result = await getImage(url,config.headDir + 'default.jpg');
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(result, "binary");
        this.res.end();
    },
    qrCode:async function(){
        
        var qr_svg = qr.imageSync('https://www.baidu.com/', { type: 'png' });
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(qr_svg, "binary");
        this.res.end();
    },
    uploadHeadImg:async function(next){
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        var user = this.session.user
        var result = await form(this.req,user,config.headDir)
        if (result.status == 200 ) {
            this.body = {status:200}
            return
        }
        await next
    },
    messageImg:async function(next){
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        var name = this.session.user + Date.parse(new Date())

        var result = await form(this.req,name,config.messageImgDir)

        this.request.body.imgUrl = name
        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }
        this.request.body.sendTo = result.msg.sendTo[0]
    },
    uploadSpecialityImg:async function(next){
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        var name = this.session.user
        var result = await uploadImgs(this.req,name,config.specialityImgDir)

        // this.request.body.imgUrl = name
        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }

        this.request.body.speciality = result.msg.speciality[0]
        this.request.body.brief = result.msg.brief[0]
        this.request.body.experience = result.msg.experience[0]
        this.request.body.names = result.msg.names
        if (result.msg.works) {
            this.request.body.works = result.msg.works[0]
        }
    },

    insertImg:async function(next){
        await next
        var result = await sqlStr("insert into message set fromMember = (select id from member where phone = ?),toMember = (select id from member where phone = ?),imgUrl = ?",[this.session.user,this.request.body.sendTo,this.request.body.imgUrl])
        if(result.affectedRows==1){
            this.body = {status:200}
            return
        }
    }
}

export default fileController
