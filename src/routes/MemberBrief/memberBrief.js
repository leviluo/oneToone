import React, { Component, PropTypes } from 'react'
import './memberBrief.scss'
import {getSpecialities,memberInfo} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips/modules/tips'
import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import Chat,{chatShow} from '../../components/Chat'

@connect(
  state=>({auth:state.auth}),
{tipShow,imgbrowserShow,chatShow})
export default class MemberBrief extends Component{
  state = {
    specialities:[],
    memberInfo:[]
  }

  componentWillMount = ()=>{
      getSpecialities(this.props.params.id).then(({data})=>{
         if (data.status==200) {
              this.setState({
                specialities:data.data
              })
          }else{
              this.props.tipShow({type:'error',msg:data.msg})
          }
      })
      memberInfo(this.props.params.id).then(({data})=>{
        if (data.status==200) {
              this.setState({
                memberInfo:data.data[0]
              })
              this.refs.headImgUrl.src = `/originImg?from=member&name=${data.data[0].phone}`
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
    e.stopPropagation()
  }

  showChat =(name,phone)=>{
        if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
        if (phone == this.props.auth.phone) return
        this.props.chatShow({chatTo:name,chatFrom:this.props.auth.nickname,sendTo:phone})
    }

  render(){
    const {sex,nickname,address,phone} = this.state.memberInfo
    // var phone = this.props.params.phone
    var qrcodeSrc = `/qrcode?text=${encodeURIComponent(window.location.href)}`
    // var headImgUrl = `/originImg?from=member&name=${phone}`
    var shareZone = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
    var shareWeibo = `http://v.t.sina.com.cn/share/share.php?&appkey=895033136?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
    return(
      <div className="memberBrief">
      <Helmet title="名片" />
        <div className="memberBriefTop">
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <div className="share">
           <i className="fa fa-share"></i>&nbsp;分享至:&nbsp;
            <a title="发送给微信好友">
            </a>
            <a href={shareZone} target="_blank" title="分享到QQ空间"></a>
            <a href={shareWeibo} target="_blank" title="分享到微博"></a>
            <a onClick={this.showQrcode} title="分享到朋友圈">
               <div><span onClick={this.closeQrcode}>×</span><img src={qrcodeSrc} alt="" /><p>扫描即可分享</p></div>
            </a>
          </div>
        </div>
        <div className="memberBriefContent">
            <div>
              <div>
                <img id="memberinfoHeadImg" ref="headImgUrl" />
              </div>
            </div>
              <ul>
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
                            return <div key={index} onClick={(e)=>this.showThisImg(index,works)} style={{backgroundImage:`url(${item.replace(/\/originImg\?/,"/img?")})`}}></div>
                              })}
                          </div>
                          </li>
                          }
                        </ul>
                    })}
                </li>
              </ul>
              <div className="message">
                <button className="btn-success" onClick={()=>this.showChat(nickname,phone)}>私信</button>
              </div>
            </div>
            <ImageBrowser />
            <Chat />
        </div>
      )
  }
}

