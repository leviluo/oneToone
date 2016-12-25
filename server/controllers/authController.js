import { getByItems, insert } from '../dbHelps/mysql'
var crypto = require('crypto'); //加载crypto库

const authController = {
    register: async function(next) {
        if (!this.request.body.phone || !this.request.body.password || !this.request.body.code || !this.request.body.nickname) {
            this.body = { status: "err", msg: "缺少参数" }
            return
        };
        delete this.request.body.code;

        var decipher = crypto.createHash('md5',"leviluo");
        this.request.body.password = decipher.update(this.request.body.password).digest('hex')  

        var result = await getByItems("member", { phone: this.request.body.phone })

        if (result.length > 0) {
            this.body = { status: "err", msg: "此用户已注册"}
            return
        }
        var resultt = await insert("member", this.request.body)
        if (resultt.affectedRows == 1) {
            this.body = { status: "success" }
            return
        };
    },
    login: async function(next) {
        var phone = this.request.body.phone
        var password = this.request.body.password
        if (!phone || !password) {
            this.body = { status: "err", msg: "缺少参数" }
            return
        };
        var decipher = crypto.createHash('md5',"leviluo");

        var result = await getByItems("member", { phone: phone, password: decipher.update(password).digest('hex') })
        if (result.length > 0) {
            this.session.user = phone
            this.body = { status: "success", nickname: result[0].nickname }
            // this.redirect('/memberCenter');页面重定向
            return
        } else {
            this.body = { status: "err", msg: "用户或密码错误" }
            return
        }
    },
    auth: async function(next) {
        if (!this.session.user) {
            this.body = ""
            return
        }
        var result = await getByItems("member", { phone: this.session.user })
        if (result.length > 0) {
            this.body = { status: "success", nickname: result[0].nickname }
            return
        } else {
            this.body = ""
            return
        }
    },
    loginOut:async function(next){
        this.session = null;
        this.body = {status:"success"}
    }
}
export default authController;
