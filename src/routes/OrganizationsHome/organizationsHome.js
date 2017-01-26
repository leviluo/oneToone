import React, { Component, PropTypes } from 'react'
import './organizationsHome.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {getBasicInfo} from './modules'
import {Link} from 'react-router'
@connect(
  state=>({auth:state.auth}),
{})
export default class OrganizationsHome extends Component{

	state = {
		BasicInfo:[]
	}

	componentWillMount =()=>{
		getBasicInfo(this.props.params.id).then(({data})=>{
			this.setState({
				BasicInfo:data.data[0]
			})
		})
	}

  render(){
  	var headImg = `/img?name=${this.state.BasicInfo.head}&from=organizations`
  	var date = new Date(this.state.BasicInfo.time)
    var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
    var link = `/memberBrief/${this.state.BasicInfo.phone}`
      return(
      <div className="organizationHome">
        <Helmet title="社团" />
        <div className="BasicInfo">
        	<div className="members">
    				<span>加入会员</span>
    				<hr />
        	</div>
        	<div className="head">
        		<img src={headImg} alt=""/>
        		<span>{this.state.BasicInfo.name}</span>
            <button className="btn-default">加入社团</button>
        	</div>
        	<div className="content">
        		<div>创建于: <span>{time}</span>&nbsp;团长:&nbsp;<Link to={link}>{this.state.BasicInfo.nickname}</Link></div>
        		<pre>
        		{this.state.BasicInfo.brief}
        		</pre>
        	</div>
        </div>
        <div className="article">
			<Link className="btn-default" to="/postArticle"><i className="fa fa-edit"></i>&nbsp;发布</Link>
        </div>
      </div>
      )
  }
}

