import React, { Component, PropTypes } from 'react'
import './article.scss'
import {getArticle} from './modules'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import {getBasicInfo,attendOrganization,getMembers,quitOrganization,getActivities} from './modules'
import {Link} from 'react-router'
import {tipShow} from '../../components/Tips/modules/tips'
import {pageNavInit} from '../../components/PageNavBar/modules/pagenavbar'
import PageNavBar from '../../components/PageNavBar'

@connect(
  state=>({
    auth:state.auth,
    pagenavbar:state.pagenavbar
  }),
{tipShow,pageNavInit})
export default class Article extends Component{

	state = {
    averagenum:1,
    articleData:[]
	}

  componentWillMount =()=>{
    getArticle(this.props.params.id).then(({data})=>{
      if (data.status==200) {
        this.setState({
          articleData:data.data
        })
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
      }
    })
  }

  render(){
    console.log(this.state.articleData)
    var headSrc = `/public/Headload?member=${this.state.articleData.phone}`
      return(
      <div className="article">
        <Helmet title="文章详情" />
        <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
        </div>
        <div className="articleContent">
          <h3>{this.state.articleData.title}</h3>
          <div className="articleContentTop">
            <img src={headSrc} alt=""/>
            <span>来自于&nbsp;:&nbsp;<Link>{this.state.articleData.nickname}</Link></span>
          </div>
          <div className="content" dangerouslySetInnerHTML={{__html:this.state.articleData.content}}>
            
          </div>
        </div>
      </div>
      )
  }
}

