import React, { Component, PropTypes } from 'react'
import './organization.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import {tipShow} from '../../components/Tips/modules/tips'
// import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'

@connect(
  state=>({auth:state.auth}),
{})
export default class MemberBrief extends Component{

  render(){
      return(
      <div className="organization">
        <div className="organizationTop">
            <div>一一社团</div>
            <ul>
            <li><a href="">运动类</a></li> 
            <li><a href="">健康类</a></li> 
            <li><a href="">生活类</a></li> 
            <li><a href="">学习类</a></li> 
            </ul>
            <div><input type="text" placeholder="搜索社团" /><button className="btn-primary"><i className="fa fa-search"></i></button></div>
        </div>
        <div className="organizationContent">
            <div className="left">
                  <h3>最新活动</h3>
            </div>
            <div className="right">
                  <h3>最热社团</h3>
            </div>
        </div>
      </div>
      )
  }
}

