import React, {Component} from 'react'
import './works.scss'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../components/Tips/modules/tips'
import {getworksData,submitPhotos,addLike,deletePhoto} from './modules'
import Confirm,{confirmShow} from '../../components/Confirm'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    // const promises = [];
    // if (!getState().catelogues.isloaded) {
    //   promises.push(dispatch(fetchCatelogue()));
    // }
    // return Promise.all(promises);
  }
}])

@connect(
  state => ({
    auth:state.auth,
    }),
  {tipShow,confirmShow}
)

export default class photos extends Component {

    state = {
      worksData:[],
      averagenum:24,
      imgs:[],
      currentPage:1
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     this.worksData(this.state.currentPage)
    }

    worksData = (currentPage)=>{
      getworksData(this.props.params.id,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
            if (data.data.length < this.state.averagenum) {
                this.setState({
                    ifFull:true,
                    worksData:this.state.worksData.concat(data.data)
                })
            }else{
                this.setState({
                    worksData:this.state.worksData.concat(data.data)
                })
            }
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
  }

  showQrcode =(e)=>{
    this.refs.qrcodeSrc.src = `/qrcode?text=${encodeURIComponent(window.location.href)}`
    e.target.childNodes[0].style.display = "block"
  }

  closeQrcode =(e)=>{
    e.target.parentNode.style.display = "none"
    e.stopPropagation()
  }

  addMore =()=>{
    if (this.state.ifFull) {
        this.props.tipShow({type:"error",msg:"亲,没有更多图片了"})
        return
    }
    this.setState({
        currentPage:this.state.currentPage + 1
    })
    this.worksData(this.state.currentPage + 1)
  }

  addLike =(e,id,index)=>{
    if (!this.props.auth.memberId) {
        this.props.tipShow({type:"error",msg:"请先登录"})
        return
    }
    addLike(id).then(({data})=>{
        if (data.status == 200) {
          if(this.state.worksData[index].isLiked){
            this.state.worksData[index].isLiked = 0;
            this.state.worksData[index].likes = this.state.worksData[index].likes - 1;
          }else{
            this.state.worksData[index].isLiked = 1;
            this.state.worksData[index].likes = this.state.worksData[index].likes + 1;
          }
          this.setState({})
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  deletePhoto =(e,id,name,index)=>{
    this.setState({
        deleteId:id,
        deleteWork:name,
        deleteindex:index
    })
    this.props.confirmShow({submit:this.confirmDelete})
  }

  confirmDelete =()=>{
    deletePhoto(this.state.deleteId,this.state.deleteWork).then(({data})=>{
        if (data.status == 200) {
          this.state.worksData.splice(this.state.deleteindex,1)
          this.setState({})
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  render () {
    var shareZone = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
    var shareWeibo = `http://v.t.sina.com.cn/share/share.php?&appkey=895033136?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
    return (
    <div className="photos">
    <Helmet title={`${this.props.location.query.specialityName}•作品集`} />
    <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          &nbsp;&nbsp;<b><Link to={`/memberBrief/${this.props.location.query.memberId}`}>{this.props.location.query.nickname}</Link>•{this.props.location.query.specialityName}•作品集</b>
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
    
    <div className="photoBoard">
      {this.state.worksData.map((item,index)=>{
        var date = new Date(item.createdAt)
        var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
        return <div key={index} className="imgShows">
            <div style={{backgroundImage:`url(/img?from=speciality&name=${item.name})`}}></div>
            <span className="pull-left lightColor">{time}</span>{this.props.auth.memberId == this.props.location.query.memberId && <button className="btn-default pull-right operate">•••<ul><li onClick={(e)=>this.deletePhoto(e,item.id,item.name,index)}>删除</li></ul></button>}<span onClick={(e)=>this.addLike(e,item.id,index)} className={`pull-right like lightColor ${item.isLiked ? 'liked' : ''}`}><i className="fa fa-heart"></i>&nbsp;{item.likes}</span>
        </div>
      })}
    </div>
    <div style={{clear:"both",textAlign:"center",padding:"20px 0"}}>
        <button className="btn-default" onClick={this.addMore}>加载更多...</button>
    </div>
    <Confirm />
    </div>
    )
  }
}

photos.propTypes = {
  auth: React.PropTypes.object
}
