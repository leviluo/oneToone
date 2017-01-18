import React, { Component, PropTypes } from 'react'
import './memberBrief.scss'

import {connect} from 'react-redux'
// import {tipShow} from '../../../components/Tips/modules/tips'
// import {modalShow} from '../../../components/Modal/modules/modal'
// import Input from '../../../components/Input'
import Helmet from 'react-helmet'
// import Modal from '../../../components/Modal'

@connect(
  state=>({auth:state.auth}),
{})
export default class MemberBrief extends Component{

  render(){
    let id = this.props.params.phone;
    return(
      <div className="memberBrief">
            <div>
              <div>
                <img id="memberinfoHeadImg" src="/member/Headload?Math.random()" />
              </div>
            </div>
              <ul>
                <li><h3><hr /><span>电话</span></h3><p>{this.props.auth.phone}</p></li>
                <li><h3><hr /><span>性别</span></h3><p>{this.state.sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p></li>
                <li><h3><hr /><span>详细地址</span></h3>{this.state.address}</li>
                <li><h3><hr /><span>专长领域</span></h3></li>
                <li>
                  {this.props.myspecialities.text.map((item,index)=>{
                    var brief = `${item.speciality}brief`;
                    var experience = `${item.speciality}experience`;
                    return <ul key={index}>
                      <li><b>{item.speciality}</b></li>
                      <li><span>简介&nbsp;:&nbsp;</span>{item.brief}</li>
                      <li><span>经验&nbsp;:&nbsp;</span>{item.experience}</li>
                    </ul>
                  }
                    )}
                </li>
              </ul>
          </div>
      )
  }
}

