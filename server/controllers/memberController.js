import { sqlStr,getByItems, insert } from '../dbHelps/mysql'

const memberController = {
    addSpeciality:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        if (!this.request.body.speciality || !this.request.body.brief || !this.request.body.experience ) {
        	this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (this.request.body.brief.length > 300) {
            this.body = { status: 500, msg: "简介超过了300个字符" }
            return
        }
        var result = await sqlStr("insert into memberSpeciality set brief = ?,experience = ?,memberId=(select id from member where phone = ?),specialitiesId=(select id from specialities where name= ?)",[this.request.body.brief,this.request.body.experience,this.session.user,this.request.body.speciality])
    	if (result.affectedRows == 1) {
            this.body = { status: 200}
            return
        };
    },
    specialities:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("select m.brief,m.experience,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId  where memberId = (select id from member where phone = ? );",[this.session.user])
        this.body = {status:200,data:result}
    },
    getMemberInfo:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("select address,sex from member where phone = ?",[this.session.user])
        this.body = {status:200,data:result}
    },
    messageText:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        if(!this.request.body.text || !this.request.body.sendTo){
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if(this.session.user == this.request.body.sendTo){
            this.body = { status: 500, msg: "不能给自己发送消息" }
            return
        }
        var result = await sqlStr("insert into message set fromMember = (select id from member where phone = ?),toMember = (select id from member where phone = ?),text = ?",[this.session.user,this.request.body.sendTo,this.request.body.text])
        if (result.affectedRows == 1) {
            this.body = { status: 200}
            return
        }else{
            this.body = { status: 500,msg:'数据库插入失败'}
        }
        await next
    },
    historyChat:async function(next){
        if (!this.request.body.chatWith) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        if (this.request.body.lastUpdate) {
        var result = await sqlStr("select m.text,m.imgUrl,m.time,mF.phone as send,mT.phone as sendto from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where (m.fromMember = (select id from member where phone = ?) and m.toMember = (select id from member where phone = ?) and m.time < ? ) or (m.toMember = (select id from member where phone = ?) and m.fromMember = (select id from member where phone = ?) and m.time < ? ) order by m.time limit 50",[this.session.user,this.request.body.chatWith,this.request.body.lastUpdate,this.session.user,this.request.body.chatWith,this.request.body.lastUpdate])
        }else{ 
        var result = await sqlStr("select m.text,m.imgUrl,m.time,mF.phone as send,mT.phone as sendto from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where (m.fromMember = (select id from member where phone = ?) and m.toMember = (select id from member where phone = ?)) or (m.toMember = (select id from member where phone = ?) and m.fromMember = (select id from member where phone = ?)) order by m.time limit 50",[this.session.user,this.request.body.chatWith,this.session.user,this.request.body.chatWith])
        }

        this.body = {status:200,data:result}
    }
}
export default memberController;

