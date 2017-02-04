import React, { Component, PropTypes } from 'react'
import './article.scss'
import {getArticle,submitReply,getArticleReply} from './modules'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import {getBasicInfo,attendOrganization,getMembers,quitOrganization,getActivities} from './modules'
import {Link} from 'react-router'
import {tipShow} from '../../components/Tips/modules/tips'
import {pageNavInit} from '../../components/PageNavBar/modules/pagenavbar'
import PageNavBar from '../../components/PageNavBar'
import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import {asyncConnect} from 'redux-async-connect'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
   
  }
}])
@connect(
  state=>({
    auth:state.auth,
    pagenavbar:state.pagenavbar
  }),
{tipShow,pageNavInit,imgbrowserShow})
export default class Article extends Component{

	state = {
    averagenum:1,
    articleData:[],
    replyData:[]
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
    getArticleReply(this.props.params.id).then(({data})=>{
      if (data.status==200) {
        this.setState({
          replyData:data.data
        })
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
      }
    })
  }



  reply =()=>{
    var comment = this.refs.replyContent.value
    if (!comment)return
    if (!this.props.auth.phone) {
      this.props.tipShow({type:"error",msg:"请先登录"})
      return
    }
    submitReply({comment:comment,articleId:this.props.params.id}).then(({data})=>{
         if (data.status==200) {
            getArticleReply(this.props.params.id).then(({data})=>{
              if (data.status==200) {
                this.setState({
                  replyData:data.data
                })
              }else{
                this.props.tipShow({type:"error",msg:data.msg})
              }
            })
          }else if (data.status==600) {
              this.props.dispatch({type:"AUTHOUT"})
              this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
    })
  }

  showQrcode =(e)=>{
    e.target.childNodes[0].style.display = "block"
  }

  closeQrcode =(e)=>{
    e.target.parentNode.style.display = "none"
    e.stopPropagation()
  }

  render(){
    var headSrc = `/public/Headload?member=${this.state.articleData.phone}`
    let link = `/memberBrief/${this.state.articleData.phone}`
    var date = new Date(this.state.articleData.updatedAt)
    var time = `${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
    var shareZone = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
    var shareWeibo = `http://v.t.sina.com.cn/share/share.php?&appkey=895033136?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
    var qrcodeSrc = `/qrcode?text=${encodeURIComponent(window.location.href)}`
      return(
      <div className="article">
        <Helmet title="文章详情" />
        <div>
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
        <div className="articleContent">
          <h3>{this.state.articleData.title}</h3>
          <div className="articleContentTop">
            <img src={headSrc} alt=""/>
            <div><span>来自于&nbsp;:&nbsp;</span><Link to={link}>{this.state.articleData.nickname}</Link><span>&nbsp;&nbsp;最后修改&nbsp;:&nbsp;</span>{time}</div>
          </div>
          <div className="content" dangerouslySetInnerHTML={{__html:this.state.articleData.content}}>
          </div>
          <div className="attachedImgs">
          {this.state.articleData.attachedImgs && <div className="imgShow"><span>附图:&nbsp;&nbsp;</span>
          {this.state.articleData.attachedImgs.split(',').map((item,index)=>{
            if (!item) return;
            if (!this.imgs) {this.imgs = []}
            var url = `/img?from=article&name=${item}`
            this.imgs.push(url)
            return <div key={index} onClick={(e)=>this.props.imgbrowserShow({currentChoose:index,imgs:this.imgs})} style={{backgroundImage:`url(${url})`}}></div>
              })}
          <button className="btn-default pull-right">回复</button>
          </div>
          }
          </div>
          <span>回复区:&nbsp;&nbsp;</span>
          <div className="historyReplys">
            {this.state.replyData.map((item,index)=>{
              var headSrc = `/public/Headload?member=${item.phone}`
              var link = `/memberBrief/${item.phone}`
              return <div key={index}>
                  <button className="btn-default pull-right">回复</button>
                  <img src={headSrc} alt="" />
                  <div><span>来自于&nbsp;:&nbsp;</span><Link to={link}>{item.nickname}</Link><p>{item.comment}</p></div>
              </div>
            })}
            {this.state.replyData.length == 0 && <div>还没有人回复耶</div>}
          </div>
          <div className="reply">
            <span>回复:</span><textarea ref="replyContent" rows="3"></textarea><button className="btn-success" onClick={this.reply}>发送</button>
          </div>
        </div>
        <ImageBrowser />
      </div>
      )
  }
}

