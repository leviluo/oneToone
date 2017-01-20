import { sqlStr,getByItems, insert } from '../dbHelps/mysql'

const memberController = {
    addSpeciality:async function(next){
        await next
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
        // console.log('resultrepeat',resultrepeat)
        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "已经添加了此专业" }
            return
        }

        // if (this.request.body.names.length > 0) {

        // var result = await sqlStr("insert into memberSpeciality set brief = ?,experience = ?,memberId=(select id from member where phone = ?),specialitiesId=(select id from specialities where name= ?)",[this.request.body.brief,this.request.body.experience,this.session.user,this.request.body.speciality])
        // if (result.affectedRows == 1 ){
        // var id = await sqlStr("select id from memberSpeciality where memberId=(select id from member where phone = ?) and specialitiesId=(select id from specialities where name= ?);",[this.session.user,this.request.body.speciality]) 
        // }else{
        //     this.body = { status: 500,msg:"插入数据失败"}
        //     return
        // }

        // var str = ''
        // for (var i = 0; i < this.request.body.names.length; i++) {
        //     this.request.body.names.splice(i*2+1, 0, id[0].id); 
        //     str += "(?,?),"
        // }

        // var resultt = await sqlStr(`insert into works(imgUrl) values${str.slice(0,-1)}`,this.request.body.names)
        // if (result.affectedRows == 1 && resultt.affectedRows > 0) {
        //     this.body = { status: 200}
        //     return
        // };
        
        // }else{
        var works = this.request.body.names.join(',')
        var result = await sqlStr("insert into memberSpeciality set brief = ?,works=?,experience = ?,memberId=(select id from member where phone = ?),specialitiesId=(select id from specialities where name= ?)",[this.request.body.brief,works,this.request.body.experience,this.session.user,this.request.body.speciality])
        if (result.affectedRows == 1 ) {
            this.body = { status: 200}
            return
        }else{
            this.body = { status: 500,msg:"插入数据失败"}
        }

        // }
    },
    specialities:async function(next){
        var phone = this.request.query.phone ? this.request.query.phone : this.session.user
        if (!phone) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select m.brief,m.experience,m.works,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId  where memberId = (select id from member where phone = ? );",[phone])
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
        if (this.request.body.lastUpdate) {
        var result = await sqlStr("select m.text,m.imgUrl,m.time,mF.phone as send,mT.phone as sendto from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where ((m.fromMember = (select id from member where phone = ?) and m.toMember = (select id from member where phone = ?)) or (m.toMember = (select id from member where phone = ?) and m.fromMember = (select id from member where phone = ?))) and unix_timestamp(m.time) < unix_timestamp(?) order by m.time desc limit 10",[this.session.user,this.request.body.chatWith,this.session.user,this.request.body.chatWith,this.request.body.lastUpdate])
        }else{ 
        var result = await sqlStr("select m.text,m.imgUrl,m.time,mF.phone as send,mT.phone as sendto from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where (m.fromMember = (select id from member where phone = ?) and m.toMember = (select id from member where phone = ?)) or (m.toMember = (select id from member where phone = ?) and m.fromMember = (select id from member where phone = ?)) order by m.time desc limit 10",[this.session.user,this.request.body.chatWith,this.session.user,this.request.body.chatWith])
        }
        this.body = {status:200,data:result}
    },
    updateActive:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        await next;
        if (!this.request.body.lastUpdate && this.body.status == 200) {
            var result = await sqlStr("update message set active = 1 where toMember = (select id from member where phone = ?) and fromMember = (select id from member where phone = ?) and active = 0",[this.session.user,this.request.body.chatWith])
        }
        // this.body = this.body
    },
    getMessageList:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("select message.time,message.text,message.imgUrl,message.active,member.nickname,member.phone,if(message.fromMember=(select id from member where phone = ?),1,0) as isSend from message left join member on (member.id = message.fromMember or member.id = message.toMember) and member.phone != ? where message.id in (select max(ms.id) from message as ms left join member as m on (m.id = ms.toMember or m.id = ms.fromMember) and m.phone != ? where ms.fromMember = (select id from member where phone = ?) or ms.toMember = (select id from member where phone = ?) group by m.phone);",[this.session.user,this.session.user,this.session.user,this.session.user,this.session.user])
        this.body = {status:200,data:result}
    },
    modifyNickname:async function(next){
        if (!this.request.body.nickname) {
            this.body = { status: 500, msg: "昵称不能为空" }
            return
        }
        if (this.request.body.nickname.length > 19) {
            this.body = { status: 500, msg: "昵称小于20个字符" }
            return
        }
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("update member set nickname = ? where phone = ?",[this.request.body.nickname,this.session.user])
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }
        this.body = {status:500,msg:"修改失败"}
    },
    modifyAddress:async function(next){
        if (!this.request.body.address) {
            this.body = { status: 500, msg: "昵称不能为空" }
            return
        }
        if (this.request.body.address.length > 98) {
            this.body = { status: 500, msg: "地址小于100个字符" }
            return
        }
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("update member set address = ? where phone = ?",[this.request.body.address,this.session.user])
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }
        this.body = {status:500,msg:"修改失败"}
        next
    },
    modifySpeciality:async function(next){
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
        // console.log()
        var result = await sqlStr("update memberSpeciality set brief = ?,experience=? where specialitiesId = (select id from specialities where name = ?) and memberId = (select id from member where phone = ?)",[this.request.body.brief,this.request.body.experience,this.request.body.speciality,this.session.user])
        
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }

        this.body = {status:500,msg:"修改失败"}
        next
    },
    deleteSpeciality:async function(next){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        if (!this.request.body.speciality) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete from memberSpeciality where specialitiesId = (select id from specialities where name = ?) and memberId = (select id from member where phone = ?)",[this.request.body.speciality,this.session.user])
        
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }

        this.body = {status:500,msg:"删除失败"}
        next
    }
}
export default memberController;

