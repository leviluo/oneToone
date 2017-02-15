import React, { Component, PropTypes } from 'react'
import './memberBrief.scss'
import {getSpecialities,memberInfo,followOne,followOutOne} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips/modules/tips'
import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import Chat,{chatShow} from '../../components/Chat'
import {Link} from 'react-router'

import {asyncConnect} from 'redux-async-connect'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
   
  }
}])

@connect(
  state=>({auth:state.auth}),
{tipShow,imgbrowserShow,chatShow})
export default class MemberBrief extends Component{

  state = {
    specialities:[],
    memberInfo:[]
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

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
    this.refs.qrcodeSrc.src = `/qrcode?text=${encodeURIComponent(window.location.href)}`
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

  followIt =()=>{
      if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
      followOne(this.state.memberInfo.id).then(({data})=>{
        if (data.status == 200) {
            this.state.memberInfo.fans = this.state.memberInfo.fans + 1
            this.state.memberInfo.isFollowed = 1
            this.setState({})
          }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  followOut =()=>{
    if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
      followOutOne(this.state.memberInfo.id).then(({data})=>{
          if (data.status == 200) {
            this.state.memberInfo.fans = this.state.memberInfo.fans - 1
            this.state.memberInfo.isFollowed = 0
            this.setState({})
          }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  render(){
    const {sex,nickname,address,phone} = this.state.memberInfo
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
               <div><span onClick={this.closeQrcode}>×</span><img ref="qrcodeSrc" alt="" /><p>扫描即可分享</p></div>
            </a>
          </div>
        </div>
        <div className="memberBriefContent">
            <div>
              <div>
                <img id="memberinfoHeadImg" ref="headImgUrl" />
              </div>
              <div className="follow">
                <span className="lightColor">关注</span>&nbsp;<strong><Link>{this.state.memberInfo.follows}</Link></strong>
                &nbsp;<span className="lightColor">粉丝</span>&nbsp;<strong><Link>{this.state.memberInfo.fans}</Link></strong>
                {(!this.state.memberInfo.isFollowed && this.props.auth.memberId != this.state.memberInfo.id) && <button className="btn-default" onClick={this.followIt}>+关注</button>}
                {(this.state.memberInfo.isFollowed == 1 && this.props.auth.memberId != this.state.memberInfo.id) && <button className="btn-default" onClick={this.followOut}>取关</button>}
              </div>
            </div>
              <ul>
                <li><h3><hr /><span>性别</span></h3><p>{sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p></li>
                <li><h3><hr /><span>详细地址</span></h3><p>{address}</p></li>
                <li><h3><hr /><span>专长领域</span></h3></li>
                <li>
                  {this.state.specialities.map((item,index)=>{
                      var linkPhotos = `/works/${item.id}`
                        return <ul key={index}>
                          <li><b>{item.speciality}</b></li>
                          <li><p>简介&nbsp;:&nbsp;</p>{item.brief}</li>
                          <li><p>经验&nbsp;:&nbsp;</p>{item.experience}</li>
                          {item.work && <li><span>作品集&nbsp;:&nbsp;</span><br/>
                            <div>
                           <ul>
                            {item.work.split(',').map((item,index)=>{
                              return <li key={index}><div style={{backgroundImage:`url(/img?name=${item}&from=speciality)`}}></div></li>
                            })}
                            <li><Link to={linkPhotos} >查看更多&gt;</Link></li>
                            </ul>
                            </div>
                          </li>}
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

