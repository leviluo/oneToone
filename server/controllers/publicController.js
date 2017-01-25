import { sqlStr } from '../dbHelps/mysql'

const publicController = {
    catelogues:async function(next){
        var result = await sqlStr("select specialities.name as childCatelogue,specialityCategory.name as parentCatelogue from specialities left join specialityCategory on specialityCategory.id = specialities.categoryId")
        this.body = {status:200,data:result}
    },
    items:async function(next){
    	if (!this.request.body.address) {
    		this.body = {status:500,msg:"缺少参数"}
    		return
    	}
        if (this.request.body.parentSpeciality) {
    	   var result = await sqlStr("select m.nickname,m.address,m.sex,m.phone,s.name,ms.brief from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.categoryId = (select id from specialityCategory where name = ? ) and (m.location = ? or m.location = ?);",[this.request.body.parentSpeciality,this.request.body.address,this.request.body.address+'市'])
        }else if(this.request.body.speciality){
           var result = await sqlStr("select m.nickname,m.address,m.sex,m.phone,s.name,ms.brief from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.name = ? and (m.location = ? or m.location = ?);",[this.request.body.speciality,this.request.body.address,this.request.body.address+'市'])
        }
    	this.body = {status:200,data:result}
    },
    getCatelogy:async function(next){
        // console.log("whji")
        var result = await sqlStr("select id as 'key',name as 'value' from specialityCategory")
        this.body = {status:200,data:result}
    },
    memberInfo:async function(next){
        if (!this.request.query.phone) {
            this.body = {status:500,msg:"缺少参数"}
            return
        }
        var result = await sqlStr("select address,sex,nickname from member where phone = ?",[this.request.query.phone])
        this.body = {status:200,data:result}
    }
}
export default publicController;


