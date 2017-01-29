import React, { Component, PropTypes } from 'react'
import './organizationsHome.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {getBasicInfo,attendOrganization,getMembers,quitOrganization,getActivities} from './modules'
import {Link} from 'react-router'
import {tipShow} from '../../components/Tips/modules/tips'

@connect(
  state=>({auth:state.auth}),
{tipShow})
export default class OrganizationsHome extends Component{

	state = {
		BasicInfo:[],
    Members:[],
    Activities:[]
	}

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

	componentWillMount =()=>{
    getBasicInfo(this.props.params.id).then(({data})=>{
      this.setState({
        BasicInfo:data.data[0]
      })
    })
    getActivities(this.props.params.id).then(({data})=>{
      this.setState({
        Activities:data.data
      })
    })
		getMembers(this.props.params.id).then(({data})=>{
      for (var i = 0; i < data.data.length; i++) {
        if(data.data[i].phone == this.props.auth.phone){
          this.setState({
            isAttended:true,
            Members:data.data
          })
          return
        }
      }
			this.setState({
				isAttended:false,
        Members:data.data
			})
		})
	}

  attendOrganization =()=>{
    if (!this.props.auth.phone) {
      this.props.tipShow({type:"error",msg:"尚未登录"})
      return
    }
    attendOrganization(this.props.params.id).then(({data})=>{
      if (data.status == 200) {
        this.setState({
            isAttended:true
          })
      }else{
          this.props.tipShow({type:"error",msg:data.msg})
          return
      }
    })
  }

  quitOrganization =()=>{
    if (!this.props.auth.phone) {
      this.props.tipShow({type:"error",msg:"尚未登录"})
      return
    }
    quitOrganization(this.props.params.id).then(({data})=>{
      if (data.status == 200) {
        this.setState({
            isAttended:false
          })
      }else{
          this.props.tipShow({type:"error",msg:data.msg})
          return
      }
    })
  }

  postArticle = (e) =>{
    if (!this.state.isAttended) {
      this.props.tipShow({type:"error",msg:"请先加入这个社团才能发帖"})
      return
    }
    this.context.router.push(`/postArticle/${this.props.params.id}`)
  }

  render(){
  	var headImg = this.state.BasicInfo.head ? `/img?name=${this.state.BasicInfo.head}&from=organizations` : ''
  	var date = new Date(this.state.BasicInfo.time)
    var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
    var link = `/memberBrief/${this.state.BasicInfo.phone}`
      return(
      <div className="organizationHome">
        <div className="organizationHomeTop">
        <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
        </div>
        <Helmet title="社团" />
        <div className="BasicInfo">

          <div className="head">
            <img src={headImg} alt=""/>
            <span>{this.state.BasicInfo.name}</span>
            {!this.state.isAttended && <button className="btn-orange" onClick={this.attendOrganization} >加入社团</button>}
            {this.state.isAttended && <button className="btn-orange" onClick={this.quitOrganization} >退出社团</button>}
          </div>

          <div className="content">
            <div>创建于: <span>{time}</span>&nbsp;团长:&nbsp;<Link to={link}>{this.state.BasicInfo.nickname}</Link></div>
            <pre>
            {this.state.BasicInfo.brief}
            </pre>
          </div>

          <div className="article">
             <span><a href="">活动</a>&nbsp;/&nbsp;<a href="">咨询</a></span>
             <button className="btn-orange" onClick={this.postArticle}><i className="fa fa-edit"></i>&nbsp;发布</button>
          </div>
          
          <table className="articleList">
            <thead>
              <tr>
                <td>标题</td>
                <td>最后更新时间</td>
                <td>发布者</td>
              </tr>
            </thead>
            <tbody>
            {this.state.Activities.map((item,index)=>{
              var date = new Date(item.updatedAt)
              var time = `${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
              var linkMember = `/memberBrief/${item.phone}`
                return <tr key={index}>
                  <td>{item.title}</td>
                  <td>{time}</td>  
                  <td><Link to={linkMember}>{item.publisher}</Link></td>
                </tr>
            })}
            </tbody>
          </table>

        </div>

      	<div className="members">
  				<span>加入会员</span>
          <div>
              {this.state.Members.map((item,index)=>{
                var headImg = `/public/Headload?member=${item.phone}`
                var link = `/memberBrief/${item.phone}`
                return <Link to={link} key={index}>
                          <img src={headImg} width="30" alt="" />
                          {item.nickname}
                        </Link>
              })}
          </div>
      	</div>
        
      </div>
      )
  }
}

