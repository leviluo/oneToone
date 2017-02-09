import React, {Component} from 'react'
import './photos.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getworksData,submitPhotos} from './modules'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'
import Modal,{modalShow,modalHide} from '../../../../components/Modal'

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
  {tipShow,pageNavInit,modalShow,modalHide}
)

export default class photos extends Component {

    state = {
      worksData:[],
      averagenum:5,
      imgs:[]
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     this.props.pageNavInit(this.worksData)
    }

    worksData = (currentPage)=>{
    return getworksData(this.props.params.id,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
          this.setState({
            worksData:data.data
          })
          return Math.ceil(data.count/this.state.averagenum)
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
  }

  savePhotos =()=>{
    // console.log(this.state.imgs)
    var fd = new FormData(); 
    for (var i = 0; i < this.state.imgs.length; i++) {
      if(this.state.imgs[i].file){
          fd.append("file", this.state.imgs[i].file)
      }
    }
    fd.append("id", this.props.params.id)
    submitPhotos(fd).then(({data})=>{

    })
  }

  hideDeleteImg=(e)=>{
          e.target.style.filter = "alpha(opacity=0)"
          e.target.style.opacity = "0"
        }

  showDeleteImg=(e,index)=>{
    e.target.style.filter = "alpha(opacity=0.8)"
    e.target.style.opacity = "80"
    var me = this
    e.target.onclick=function(e){
      e.srcElement.parentNode.parentNode.removeChild(e.srcElement.parentNode)
      for (var i = 0; i < me.state.imgs.length; i++) {
          if(me.state.imgs[i].key == e.target.getAttribute('name')){
              me.state.imgs.splice(i,1)
              break
          }
      }
      me.setState({})
    }
  }

  addImages = (e)=>{
          var value = e.target.value
          var filextension=value.substring(value.lastIndexOf("."),value.length);
          filextension = filextension.toLowerCase();
          if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
          {
          this.props.tipShow({type:'error',msg:'文件类型不正确'})
          return;
          }

          for (var i = e.target.files.length - 1; i >= 0; i--) {
              var fileUrl = window.URL.createObjectURL(e.target.files[i])
              var div = document.createElement('div')
              div.className = "imgList"
              div.style.backgroundImage = `url(${fileUrl})`

              var divDelete = document.createElement('div')
              divDelete.onmouseout = this.hideDeleteImg
              divDelete.onmouseover = this.showDeleteImg
              divDelete.className = "fa fa-trash"
              var key = Date.parse(new Date())
              divDelete.setAttribute('name',key)

              div.appendChild(divDelete)

              this.refs.add.appendChild(div)
              this.state.imgs.push({key:key,file:e.target.files[i]})
          };
          this.setState({})
      }

  render () {
    return (
    <div className="photos">
    <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <button className="btn-success pull-right" >选择图片<input type="file" onChange={this.addImages} multiple/></button>
    </div>
    <div className="addDIV">
    <div ref="add" className="add">
    </div>
    {this.state.imgs.length > 0 && <div className="submit"><button onClick={this.savePhotos} className="btn-success">上传</button></div>}
    </div>

    {this.state.worksData.length == 0 && <div className="text-center">您还没有任何作品耶,赶快上传吧~</div>}
      <table>
        <tbody>
        { this.state.worksData.length > 0 && <tr className="lightColor">
          <td>请求时间</td>
          <td>请求人</td>
          <td>验证信息</td>
          <td>操作</td>
        </tr>
        }
        {this.state.worksData.map((item,index)=>{
          var link = `/memberBrief/${item.memberId}`
          var date = new Date(item.createdAt)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          return <tr key={index}>
            <td>{time}</td>
            <td><Link to={link}>{item.nickname}</Link></td>
            <td>{item.verified}</td>
            <td><button className="btn-default" onClick={(e)=>this.isApprove(e,0,item.id)} >忽略</button><button onClick={(e)=>this.isApprove(e,1,item.id)}  className="btn-success">通过</button></td>
          </tr>
        })}
        </tbody>
      </table>
      <PageNavBar />
      <Modal />
    </div>
    )
  }
}

photos.propTypes = {
  auth: React.PropTypes.object
}
