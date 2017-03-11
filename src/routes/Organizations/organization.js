import React, { Component, PropTypes } from 'react'
import './organization.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips/modules/tips'
// import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import {OrganizationsSortByHot,getUpdates} from './modules'
import {Link} from 'react-router'

@connect(
  state=>({
    auth:state.auth,
    mylocation:state.mylocation
  }),
{tipShow})
export default class MemberBrief extends Component{

  state = {
    organizations:[],
    updates:[],
    averagenum:10,
    currentPage:1
  }

  componentWillMount =()=>{
    OrganizationsSortByHot().then(({data})=>{
      this.setState({
        organizations : data.data
      })
    })
    if(this.props.mylocation.text[0])this.getData(this.state.currentPage,this.props.mylocation.text[0])
  }

  componentWillReceiveProps=(nextProps)=>{ //刷新时获取memberId
      if ((nextProps.mylocation.text[0] != this.props.mylocation.text[0]) && this.props.mylocation.text[0]) {
        this.setState({
          updates:[]
        })
      }
      if(nextProps.mylocation.text[0])this.getData(this.state.currentPage,nextProps.mylocation.text[0])
  }

  getData = (currentPage,location)=>{
       getUpdates(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`,location).then(({data})=>{
        if (data.status == 200) {
          if (data.data.length < this.state.averagenum) {
                this.setState({
                    ifFull:true,
                    updates:this.state.updates.concat(data.data)
                })
            }else{
                this.setState({
                    updates:this.state.updates.concat(data.data)
                })
            }
        }else{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
    }


  render(){
    console.log()
      return(
      <div className="organization">
        <Helmet title="社团中心" />
        <div className="organizationTop">
            <div>一一社团</div>

        </div>
        <div className="organizationContent">
            <div className="left">
                  <h3>最新活动</h3>
                  <div className="updates">
                      {this.state.updates.length == 0 && <div style={{textAlign:"center"}}>暂时没有任何动态哦~</div>}
                      {this.state.updates.map((item,index)=>{
                        var date = new Date(item.createAt)
                        var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                        return <div key={index} className="lists">
                            <img width="50" src={`/originImg?from=member&name=${item.phone}`} alt=""/>
                            {item.title && <div className="header"><span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;<Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link>在<Link to={`/organizationsHome/${item.organizationsId}`}>{item.organizationName}</Link>发布了<Link to={`/article/${item.articleId}`}>{item.title}({item.titleType})</Link></div>}
                        </div>
                      })}
                      {!this.state.ifFull && <p><button className="btn-addMore" onClick={this.addMore}>加载更多...</button></p>}
                  </div>
            </div>
            <div className="right">
                  <h3>最热社团</h3>
                  <div>
                  {this.state.organizations.map((item,index)=>{
                    var headImg = `/originImg?from=organizations&name=${item.head}`
                    var link = `/organizationsHome/${item.id}`
                    return <Link to={link} key={index}>
                              <img src={headImg} width="30" alt="" />
                              {item.name}
                            </Link>
                  })}
              </div>
            </div>
        </div>
      </div>
      )
  }
}

