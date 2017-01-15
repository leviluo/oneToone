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
        var resultcount = await sqlStr("select count(*) as count from memberSpeciality where memberId=(select id from member where phone = ?)",[this.session.user])
        if(resultcount[0].count > 4){
            this.body = { status: 500, msg: "最多添加5项专业" }
            return
        }

        var resultrepeat = await sqlStr("select * from memberSpeciality where memberId=(select id from member where phone = ?) and specialitiesId=(select id from specialities where name= ?)",[this.session.user,this.request.body.speciality])
        
        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "已经添加了此专业" }
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
        var result = await sqlStr("select m.text,m.imgUrl,m.time,mF.phone as send,mT.phone as sendto from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where ((m.fromMember = (select id from member where phone = ?) and m.toMember = (select id from member where phone = ?)) or (m.toMember = (select id from member where phone = ?) and m.fromMember = (select id from member where phone = ?))) and unix_timestamp(m.time) < unix_timestamp(?) order by m.time desc limit 10",[this.session.user,this.request.body.chatWith,this.session.user,this.request.body.chatWith,this.request.body.lastUpdate])
        }else{ 
        var result = await sqlStr("select m.text,m.imgUrl,m.time,mF.phone as send,mT.phone as sendto from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where (m.fromMember = (select id from member where phone = ?) and m.toMember = (select id from member where phone = ?)) or (m.toMember = (select id from member where phone = ?) and m.fromMember = (select id from member where phone = ?)) order by m.time desc limit 10",[this.session.user,this.request.body.chatWith,this.session.user,this.request.body.chatWith])
        var resultt = await sqlStr("update message set active = 1 where toMember = (select id from member where phone = ?) and fromMember = (select id from member where phone = ?)",[this.session.user,this.request.body.chatWith])
        }
        this.body = {status:200,data:result}
    },
    getMessageList:async function(){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("select message.time,message.text,message.imgUrl,message.active,member.nickname,member.phone,if(message.fromMember=(select id from member where phone = ?),1,0) as isSend from message left join member on (member.id = message.fromMember or member.id = message.toMember) and member.phone != ? where message.id in (select max(ms.id) from message as ms left join member as m on (m.id = ms.toMember or m.id = ms.fromMember) and m.phone != ? where ms.fromMember = (select id from member where phone = ?) or ms.toMember = (select id from member where phone = ?) group by m.phone);",[this.session.user,this.session.user,this.session.user,this.session.user,this.session.user])
        this.body = {status:200,data:result}
    }
}
export default memberController;
