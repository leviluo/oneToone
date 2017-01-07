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
    specialities:async function(){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("select m.brief,m.experience,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId  where memberId = (select id from member where phone = ? );",[this.session.user])
        this.body = {status:200,data:result}
    }
}
export default memberController;
