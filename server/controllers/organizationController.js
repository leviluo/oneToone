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
      var resultt = await sqlStr("insert into memberOrganizations set memberId = (select id from member where phone = ?),organizationsId=(select id from organizations where name = ? and createById = (select id from member where phone = ?));",[this.session.user,this.request.body.name[0],this.session.user])
 
      if (result.affectedRows == 1 && resultt.affectedRows == 1) {
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
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var result = await sqlStr("select o.*,s.name as categoryName from organizations as o left join specialitycategory as s on s.id = o.categoryId where createById = (select id from member where phone = ?)",[this.session.user])
        this.body = {status:200,data:result}
    },
    deleteOrganization:async function(){
       if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
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
    },
    getMembers: async function(){
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select m.phone,m.nickname from memberOrganizations as mo left join member as m on mo.memberId = m.id where mo.organizationsId = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    addArticle: async function(next){
      await next;
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var data = this.request.body
      var result = await sqlStr("insert into article set title = ?,type = ?,content =?,organizationId =?,attachedImgs=?,memberId = (select id from member where phone = ?)",[data.header[0],data.type[0],data.content[0],data.organizationId[0],data.names.join(','),this.session.user])
      if (result.affectedRows == 1) {
            this.body = {status:200}
            return
      }
      this.body = {status:500,msg:"发布失败"}
    },
    attendOrganization: async function(next){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("insert into memberOrganizations set memberId = (select id from member where phone = ?),organizationsId=?;",[this.session.user,this.request.query.id])
      if (result.affectedRows == 1) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"加入失败"}
    },
    quitOrganization: async function(next){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("delete from memberOrganizations where memberId = (select id from member where phone = ?) and organizationsId=?;",[this.session.user,this.request.query.id])
      if (result.affectedRows == 1) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"操作失败"}
    },
    OrganizationsSortByHot:async function(next){
      var result = await sqlStr("select head,name,id,(select count(*) from memberOrganizations where organizations.id = memberOrganizations.organizationsId) as countt from organizations order by countt limit 20")
      this.body = {status:200,data:result}
    },
    getAllActivities:async function(next){
      var result = await sqlStr("select a.id,a.organizationId,o.name,a.title,a.updatedAt,m.nickname as publisher,m.phone from article as a left join member as m on m.id = a.memberId left join organizations as o on o.id = a.organizationId where a.type = 0")
      this.body = {status:200,data:result}
    },
    getActivities:async function(next){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("select a.id,a.title,a.updatedAt,m.nickname as publisher,m.phone from article as a left join member as m on m.id = a.memberId where a.type = 0 and a.organizationId = ?",[this.request.query.id])
      this.body = {status:200,data:result}
    },
    article:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("select a.*,m.nickname,m.phone from article as a left join member as m on m.id = a.memberId where a.id = ?",[this.request.query.id])
      this.body = {status:200,data:result[0]}
    },
    reply:async function(){
      if (!this.request.body.comment || !this.request.body.articleId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.session.user) {
          this.body = { status: 600, msg: "尚未登录" }
          return
        }
      var result = await sqlStr("insert into comments set memberId = (select id from member where phone = ?),articleId=?,comment=?;",[this.session.user,this.request.body.articleId,this.request.body.comment])
      if (result.affectedRows == 1) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"插入失败"}
    },
    ArticleReply:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("select c.comment,m.nickname,m.phone from comments as c left join member as m on m.id = c.memberId where c.articleId=?",[this.request.query.id])
      this.body = {status:200,data:result}
    }
}
export default organizationController;

