import { sqlStr,getByItems, insert } from '../dbHelps/mysql'

const organizationController = {
    addOrganization:async function(next) {
       await next;

       var resultcount = await sqlStr("select count(*) as count from organizations where createById=(select id from member where phone = ?)",[this.session.user])
        if(resultcount[0].count > 4){
            this.body = { status: 500, msg: "最多可创建5个社团" }
            return
        }

        var resultrepeat = await sqlStr("select * from organizations where createById=(select id from member where phone = ?) and name=?",[this.session.user,this.request.body.name[0]])

        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "社团名称不能重复" }
            return
        }

       var result = await sqlStr("insert into organizations set name = ?,brief=?,head=?,createById=(select id from member where phone = ?),categoryId=?",[this.request.body.name[0],this.request.body.brief[0],this.request.body.names[0],this.session.user,this.request.body.categoryId[0]])
        if (result.affectedRows == 1 ) {
            this.body = { status: 200}
            return
        }else{
            this.body = { status: 500,msg:"插入数据失败"}
        }
    },
    modifyOrganization:async function(next) {
       await next;

       var resultrepeat = await sqlStr("select * from organizations where createById=(select id from member where phone = ?) and name=? and id != ?",[this.session.user,this.request.body.name[0],this.request.body.id[0]])

      if(resultrepeat.length > 0){
          this.body = { status: 500, msg: "社团名称不能重复" }
          return
      }

       if (this.request.body.name[0]) {
       var result = await sqlStr("update organizations set name = ?,brief=?,head=? where id = ?",[this.request.body.name[0],this.request.body.brief[0],this.request.body.names[0],this.request.body.id[0]])
       }else{
       var result = await sqlStr("update organizations set brief=?,head=? where id = ?",[this.request.body.brief[0],this.request.body.names[0],this.request.body.id[0]])
       }
        if (result.affectedRows == 1 ) {
            this.body = { status: 200}
            return
        }else{
            this.body = { status: 500,msg:"更新数据失败"}
        }
    },
    getOrganizationByMe:async function(){
        if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        var result = await sqlStr("select o.*,s.name as categoryName from organizations as o left join specialitycategory as s on s.id = o.categoryId where createById = (select id from member where phone = ?)",[this.session.user])
        this.body = {status:200,data:result}
    },
    deleteOrganization:async function(){
       if (!this.session.user) {
            this.body = { status: 500, msg: "未登录" }
            return
        }
        if (!this.request.body.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete from organizations where id = ?",[this.request.body.id])
        
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }

        this.body = {status:500,msg:"删除失败"}
    },
    basicInfo: async function(){
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select o.*,s.name as categoryName,m.nickname,m.phone from organizations as o left join member as m on m.id = o.createById left join specialitycategory as s on s.id = o.categoryId where o.id = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    }
}
export default organizationController;
