import { sqlStr } from '../dbHelps/mysql'

const publicController = {
    catelogues:async function(next){
        var result = await sqlStr("select specialities.name as childCatelogue,specialityCategory.name as parentCatelogue from specialities left join specialityCategory on specialityCategory.id = specialities.categoryId")
        this.body = {status:200,data:result}
    },
    items:async function(next){
        if (!this.request.body.address || !this.request.body.limit) {
            this.body = {status:500,msg:"缺少参数"}
            return
        }
        if (this.request.body.parentSpeciality) {
           var result = await sqlStr("select m.nickname,m.address,m.sex,m.phone,ms.memberId,s.name,ms.brief from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.categoryId = (select id from specialityCategory where name = ? ) and m.location = ? limit "+this.request.body.limit,[this.request.body.parentSpeciality,this.request.body.address])
            var count = await sqlStr("select count(m.id) as count from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.categoryId = (select id from specialityCategory where name = ? ) and m.location = ? ",[this.request.body.parentSpeciality,this.request.body.address])
        }else if(this.request.body.speciality){
           var result = await sqlStr("select m.nickname,m.address,m.sex,m.phone,ms.memberId,s.name,ms.brief from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.name = ? and m.location = ? limit "+this.request.body.limit,[this.request.body.speciality,this.request.body.address])
           var count = await sqlStr("select count(m.id) as count from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.name = ? and m.location = ?",[this.request.body.speciality,this.request.body.address])
        }
        this.body = {status:200,data:result,count:count[0].count}
    },
    getCatelogy:async function(next){
        // console.log("whji")
        var result = await sqlStr("select id as 'key',name as 'value' from specialityCategory")
        this.body = {status:200,data:result}
    },
    memberInfo:async function(next){
        if (!this.request.query.id) {
            this.body = {status:500,msg:"缺少参数"}
            return
        }
        if (this.session.user) {
        var result = await sqlStr("select m.address,m.id,m.brief,m.sex,m.nickname,m.phone,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans,if((select id from follows where followId = ? and memberId = (select id from member where phone = ?)),1,0) as isFollowed from member as m where id = ?",[this.request.query.id,this.session.user,this.request.query.id])
        }else{
        var result = await sqlStr("select m.address,m.id,m.brief,m.sex,m.nickname,m.phone,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans from member as m where id = ?",[this.request.query.id])
        }
        this.body = {status:200,data:result}
    },
    getWorks:async function(){
      if (!this.request.query.limit) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }
      if (this.session.user && this.request.query.id) {
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = (select id from member where phone = ?) limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? order by id desc limit "+this.request.query.limit,[this.session.user,this.request.query.id])
      }else if(this.request.query.id){
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? order by id desc limit "+this.request.query.limit,[this.request.query.id])
      }else{
        this.body = {status:600,msg:"尚未登录"}
        return
      }
      var count = await sqlStr("select count(id) as count from works where memberSpecialityId = ?",[this.request.query.id])
      this.body = {status:200,data:result,count:count[0].count}
    },
    getWorksFrom:async function(){
      if (!this.request.query.limit || !this.request.query.worksId) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }
      if (this.session.user && this.request.query.id) {
        if (this.request.query.direction == 1) {
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = (select id from member where phone = ?) limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? and w.id >= ? limit "+this.request.query.limit,[this.session.user,this.request.query.id,this.request.query.worksId])
        }else{
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = (select id from member where phone = ?) limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? and w.id <= ? order by w.id desc limit "+this.request.query.limit,[this.session.user,this.request.query.id,this.request.query.worksId])
        }
      }else if(this.request.query.id){
        if (this.request.query.direction == 1) {
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? and w.id >= ? limit "+this.request.query.limit,[this.request.query.id,this.request.query.worksId])
        }else{
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? and w.id <= ? order by w.id desc limit "+this.request.query.limit,[this.request.query.id,this.request.query.worksId])
        }
      }else{
        this.body = {status:600,msg:"尚未登录"}
        return
      }

      var count = await sqlStr("select count(id) as count from works where memberSpecialityId = ?",[this.request.query.id])
      this.body = {status:200,data:result,count:count[0].count}
    },
    specialities:async function(next){
        if (this.request.query.id) {
        var result = await sqlStr("select m.brief,m.experience,m.id,m.memberId,substring_index((select GROUP_CONCAT(name order by createdAt desc) from works where memberSpecialityId = m.id),',',8) as work,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId  where memberId = ?;",[this.request.query.id])
        }else if (this.session.user) {
        var result = await sqlStr("select m.brief,m.experience,m.id,m.memberId,substring_index((select GROUP_CONCAT(name order by createdAt desc) from works where memberSpecialityId = m.id),',',6) as work,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId  where memberId = (select id from member where phone = ?)",[this.session.user])
        }else{
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        this.body = {status:200,data:result}
    },
    getMemberInfoWork: async function(){
        if (!this.request.query.id) {
           this.body = {status:500,msg:"缺少参数"}
            return 
        }
        var result = await sqlStr("select m.phone,m.nickname,m.id as memberId,s.name from works as w left join memberSpeciality as ms on ms.id = w.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where w.memberSpecialityId = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    getFollows: async function(){
      if (!this.request.query.id || !this.request.query.limit) {
           this.body = {status:500,msg:"缺少参数"}
            return 
        }
      var result = await sqlStr("select m.nickname,m.phone,m.brief,m.id from follows as f left join member as m on m.id = f.followId where f.memberId = ? limit "+this.request.query.limit,[this.request.query.id])
      this.body = {status:200,data:result}
    },
    getFans: async function(){
      if (!this.request.query.id || !this.request.query.limit) {
           this.body = {status:500,msg:"缺少参数"}
            return 
      }
      var result = await sqlStr("select m.nickname,m.phone,m.brief,m.id from follows as f left join member as m on m.id = f.memberId where f.followId = ? limit "+this.request.query.limit,[this.request.query.id])
      this.body = {status:200,data:result}
    },
    getMyUpdates:async function(){
        if (!this.request.query.id || !this.request.query.limit) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }

        var result = await sqlStr("select mu.id,m.phone,if(a.type = 0,'活动','咨询') as titleType,a.title,o.name as organizationName,s.name as specialityName,a.organizationsId,mu.memberSpecialityId,mu.articleId,mu.works,mu.createAt from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId left join article as a on a.id = mu.articleId left join organizations as o on o.id = a.organizationsId left join member as m on m.id = mu.memberId where mu.memberId = ? order by mu.id desc limit "+this.request.query.limit,[this.request.query.id])

        this.body = {status:200,data:result}
    },
    getPhotoUpdates:async function(){
        if (!this.request.query.location) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select mu.id,m.nickname,s.name as specialityName,mu.memberSpecialityId,mu.articleId,mu.memberId,mu.works,mu.createAt from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId left join member as m on m.id = mu.memberId where m.location = ? and mu.works != '' order by mu.id desc limit "+this.request.query.limit,[this.request.query.location])
        this.body = {status:200,data:result}
    },
    getTitleUpdates:async function(){
        if (!this.request.query.location) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select mu.id,m.nickname,if(a.type = 0,'活动','咨询') as titleType,a.title,o.name as organizationName,s.name as specialityName,a.organizationsId,mu.memberSpecialityId,mu.articleId,mu.memberId,mu.createAt from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId left join article as a on a.id = mu.articleId left join organizations as o on o.id = a.organizationsId left join member as m on m.id = mu.memberId where m.location = ? and mu.articleId != '' order by mu.id desc limit "+this.request.query.limit,[this.request.query.location])
        this.body = {status:200,data:result}
    }
}
export default publicController;


