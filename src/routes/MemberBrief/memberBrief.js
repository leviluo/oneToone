import React, { Component, PropTypes } from 'react'
import './memberBrief.scss'
import {getSpecialities} from './modules/memberBrief'

import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips/modules/tips'
// import {modalShow} from '../../../components/Modal/modules/modal'
// import Input from '../../../components/Input'
import Helmet from 'react-helmet'
// import Modal from '../../../components/Modal'
import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'

@connect(
  state=>({auth:state.auth}),
{tipShow,imgbrowserShow})
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

  showThisImg =(index,works)=>{
    this.props.imgbrowserShow({currentChoose:index,imgs:works})
  }

  showQrcode =(e)=>{
    e.target.childNodes[0].style.display = "block"
  }

  closeQrcode =(e)=>{
    e.target.parentNode.style.display = "none"
  }

  render(){
    const {phone,sex,nickname,address} = this.props.location.query
    console.log(encodeURIComponent(window.location.href))
    var qrcodeSrc = `/qrcode?text=${encodeURIComponent(window.location.href)}`
    var headImgUrl = `/public/Headload?member=${phone}`
    return(
      <div className="memberBrief">
        <div className="memberBriefTop">
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <div className="share">
           <i className="fa fa-share"></i>&nbsp;分享至:&nbsp;
            <a>
            </a>
            <a></a>
            <a></a>
            <a onClick={this.showQrcode}>
               <div><span onClick={this.closeQrcode}>×</span><img src={qrcodeSrc} alt="" /><p>扫描即可分享</p></div>
            </a>
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
                  {this.state.specialities.map((item,index)=>{
                        var works = item.works.split(',')
                        for (var i = 0; i < works.length; i++) {
                         if(works[i])works[i] = `/img?from=speciality&name=${works[i]}`
                        }
                        return <ul key={index}>
                          <li><b>{item.speciality}</b></li>
                          <li><p>简介&nbsp;:&nbsp;</p>{item.brief}</li>
                          <li><p>经验&nbsp;:&nbsp;</p>{item.experience}</li>
                          {item.works && <li><p>作品展示&nbsp;:&nbsp;</p>
                          <div className="imgShow">
                          {works.map((item,index)=>{
                            if (!item) return;
                            return <div key={index} onClick={(e)=>this.showThisImg(index,works)} style={{backgroundImage:`url(${item})`}}></div>
                              })}
                          </div>
                          </li>
                          }
                        </ul>
                    })}
                </li>
              </ul>
            </div>
            <ImageBrowser />
        </div>
      )
  }
}

