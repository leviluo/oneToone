import React, { Component, PropTypes } from 'react'
import './memberBrief.scss'
import {getSpecialities} from './modules/memberBrief'

import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips/modules/tips'
// import {modalShow} from '../../../components/Modal/modules/modal'
// import Input from '../../../components/Input'
import Helmet from 'react-helmet'
// import Modal from '../../../components/Modal'

@connect(
  state=>({auth:state.auth}),
{tipShow})
export default class MemberBrief extends Component{
  state = {
    specialities:[]
  }

  componentWillMount = ()=>{
      getSpecialities(this.props.location.query.phone).then(({data})=>{
         if (data.status==200) {
              this.setState({
                specialities:data.data
              })
          }else{
              this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  render(){
    const {phone,sex,nickname,address} = this.props.location.query
    var headImgUrl = `/member/Headload?phone=${phone}`
    return(
      <div className="memberBrief">
        <div className="memberBriefTop">
          <a href="">返回<i className="fa fa-mail-reply"></i></a>
          <div className="share">
           <i className="fa fa-share"></i>分享至:&nbsp;
            <a></a>&nbsp;&nbsp;
            <a></a>&nbsp;&nbsp;
            <a></a>
          </div>
        </div>
        <div className="memberBriefContent">
            <div>
              <div>
                <img id="memberinfoHeadImg" src={headImgUrl} />
              </div>
            </div>
              <ul>
                <li><h3><hr /><span>电话</span></h3><p>{phone}</p></li>
                <li><h3><hr /><span>性别</span></h3><p>{sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p></li>
                <li><h3><hr /><span>详细地址</span></h3><p>{address}</p></li>
                <li><h3><hr /><span>专长领域</span></h3></li>
                <li>
                  {this.state.specialities.map((item,index)=>
                        <ul key={index}>
                          <li><b>{item.speciality}</b></li>
                          <li><span>简介&nbsp;:&nbsp;</span>{item.brief}</li>
                          <li><span>经验&nbsp;:&nbsp;</span>{item.experience}</li>
                        </ul>
                    )}
                </li>
              </ul>
            </div>
        </div>
      )
  }
}

