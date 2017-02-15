import React, {Component} from 'react'
import './follows.scss'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../components/Tips/modules/tips'
import {getworksData,addLike,deletePhoto,getMemberInfo} from './modules'
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

export default class follows extends Component {

    state = {
      worksData:[],
      averagenum:24,
      imgs:[],
      currentPage:1,
      memberInfo:[]
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     getMemberInfo(this.props.params.memberSpecialityId).then(({data})=>{
        if (data.status == 200) {
            this.setState({
                memberInfo:data.data[0]
            })
        }else{
          this.props.tipShow({type:'error',msg:data.msg})
        }
     })
     this.worksData(this.state.currentPage)
    }

    worksData = (currentPage)=>{
      getworksData(this.props.params.memberSpecialityId,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
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
    <Helmet title="关注列表" />
          11111
    </div>
    )
  }
}

follows.propTypes = {
  auth: React.PropTypes.object
}
