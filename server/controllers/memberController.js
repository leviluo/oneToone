import { sqlStr,getByItems, insert } from '../dbHelps/mysql'

const memberController = {
    addSpeciality:async function(next){
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        if (!this.request.body.speciality || !this.request.body.brief || !this.request.body.experience ) {
        	this.body = { status: "err", msg: "缺少参数" }
            return
        }
        var result = await sqlStr(`insert into memberSpeciality set brief = "${this.request.body.brief}",experience = "${this.request.body.experience}",memberId=(select id from member where phone = "${this.session.user}"),specialitiesId=(select id from specialities where name="${this.request.body.speciality}")`)
    	if (result.affectedRows == 1) {
            this.body = { status: "success"}
            return
        };
    },
    specialities:async function(){
        if (!this.session.user) {
            this.body = { status: "err", msg: "未登录" }
            return
        }
        var result = await sqlStr(`select m.brief,m.experience,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId`)
        this.body = {status:'success',data:result}
    }
}
export default memberController;
