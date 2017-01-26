import React, {Component} from 'react'
import Select from '../../../../components/Select'
import Textarea from '../../../../components/Textarea'
import './basicInfo.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {commitHeadImg,getMemberInfo,addSpeciatity,fetchSpeciality,modifyNickname,modifyAddress,modifySpeciality,updateSpeciality,deleteSpeciality} from './modules/basicInfo'
import Modal,{modalShow,modalHide,modalUpdate} from '../../../../components/Modal'
import {imgbrowserShow} from '../../../../components/ImageBrowser'
import {fetchCatelogue} from '../../../../reducers/category'
import {modifyNickname as modifyname} from '../../../../reducers/auth'
import {asyncConnect} from 'redux-async-connect'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    // if (!getState().myspecialities.isloaded) {
      promises.push(dispatch(fetchSpeciality()));
    // }
    if (!getState().catelogues.isloaded) {
      promises.push(dispatch(fetchCatelogue()));
    }
    return Promise.all(promises);
  }
}])

@connect(
  state => ({
    auth:state.auth,
    myspecialities:state.myspecialities,
    catelogues:state.catelogues
    }),
  {modalShow,modalHide,tipShow,commitHeadImg,addSpeciatity,modifyname,updateSpeciality,fetchSpeciality,modalUpdate,imgbrowserShow}
)

export default class BasicInfo extends Component {

  state ={
    content: <div></div>,
    address: '',
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    getMemberInfo().then(({data}) => {
        if (data.status==200) {
            this.setState({
              address:data.data[0].address,
              sex:data.data[0].sex
            })
        }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
  }


   modifyHead =(e)=>{
    //判断文件类型
    var value = e.target.value
    var filextension=value.substring(value.lastIndexOf("."),value.length);
    filextension = filextension.toLowerCase();
    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
    {
    this.props.tipShow({type:'error',msg:'文件类型不正确'})
    return;
    }

    if (document.getElementById('editCanvas')) { //清空画布
      document.getElementById('editCanvas').getContext("2d").clearRect(0,0,300,150);  
    }

    var imageUrl = window.URL.createObjectURL(e.target.files[0])
    var content = <div id="headerEdit" onWheel={this.imgZoom} style={{width:"400px",height:'250px',position:'relative',margin:'0 auto',backgroundImage:`url(${imageUrl})`,backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundSize:'100%'}}>
                <div style={{width:'400px',height:'75px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <div style={{width:'150px',height:'100px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <canvas id="editCanvas" width="100" height="100" style={{width:'100px',height:'100px',float:'left',margin:'0',cursor:'move',border:'1px solid white'}} onMouseDown={this.start} onMouseUp={this.end} onMouseOut={this.end} ></canvas>
                <div style={{width:'150px',height:'100px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <div style={{width:'400px',height:'75px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <img id="editImg" src={imageUrl} alt="" style={{display:'none'}}/>
      </div>

    this.props.modalShow({header:"修改头像",content:content,submit:this.modifyHeadSubmit})
  }

  imgZoom =(e)=>{ //放大缩小图片
    var element = document.getElementById('headerEdit')
    if(parseFloat(element.style.backgroundSize.slice(0,-1))>400){
      element.style.backgroundSize = "400%"
      return
    }
    if(parseFloat(element.style.backgroundSize.slice(0,-1))<25){
      element.style.backgroundSize = "25%"
      return
    }
    if(e.deltaY > 0){
      element.style.backgroundSize = parseFloat(element.style.backgroundSize.slice(0,-1))/1.1+'%'
    }else{
      element.style.backgroundSize = parseFloat(element.style.backgroundSize.slice(0,-1))*1.1+'%'
    }
  }


  modifyHeadSubmit =()=>{ //提交
    this.editInit()
    var element = document.getElementById('headerEdit')
    var image = document.getElementById('editImg')
    var ratio = image.width*100/(400*parseFloat(element.style.backgroundSize.slice(0,-1)))
    var ctx=this.divcenter.getContext("2d");

    var X = (this.divcenter.offsetLeft - (400-image.width/ratio)/2) * ratio;
    var Y = (this.divcenter.offsetTop - (250-image.height/ratio)/2) * ratio;

    ctx.drawImage(image,X,Y,100*ratio,100*ratio,0,0,100,100)

    var data=this.divcenter.toDataURL();
    // console.log(data)
    // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
    data=data.split(',')[1];
    // console.log(data)
    data=window.atob(data);
    // console.log(data)
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    };
    // canvas.toDataURL 返回的默认格式就是 image/png
    var blob=new Blob([ia], {type:"image/png"});
    // console.log(blob)
    var fd=new FormData();
    fd.append('file',blob);
    // console.log(fd)
    this.props.commitHeadImg(fd,this.props.auth.phone)
    this.props.modalHide()
  }

  editInit=(e)=>{
    var headerEdit = document.getElementById('headerEdit')
    if(!this.divtop)this.divtop = headerEdit.getElementsByTagName('div')[0]
    if(!this.divcenterLeft)this.divcenterLeft = headerEdit.getElementsByTagName('div')[1]
    if(!this.divcenter)this.divcenter = headerEdit.getElementsByTagName('canvas')[0]
    if(!this.divcenterRight)this.divcenterRight = headerEdit.getElementsByTagName('div')[2]
    if(!this.divottom)this.divottom = headerEdit.getElementsByTagName('div')[3]
  }

  start =(e)=>{ //可移动选区
    this.editInit()
    var startX = e.clientX;
    var startY = e.clientY; 
    document.onmousemove = (e)=>{
         var diffX = e.clientX - startX
         var diffY = e.clientY - startY
         var divtopH = Math.min(150,parseFloat(this.divtop.style.height.slice(0,-2))+ diffY)
         var divleftW = Math.min(300,parseFloat(this.divcenterLeft.style.width.slice(0,-2))+ diffX)
         divleftW = Math.max(0,divleftW)
         if (divleftW == 0) {
          this.divcenterLeft.style.height = 0;
         }else{
          this.divcenterLeft.style.height = '100px';
         }
         this.divtop.style.height = divtopH + 'px';
         this.divcenterLeft.style.width = divleftW + 'px'
         this.divcenterRight.style.width = 300 - divleftW + 'px'
         this.divottom.style.height = (150-divtopH) + 'px';
         startX = e.clientX;
         startY = e.clientY;
    }
  }

  end =(e)=>{
    document.onmousemove = null;
  }

  addSpeciatity=()=>{

    var speciality = this.refs.speciality.getValue()
    var brief = this.refs.brief.getValue()
    var experience = this.refs.experience.getValue()

    if (!speciality) {
      this.props.tipShow({type:"error",msg:"选择一个专业"})
      return
    }
    if (!brief || brief.length < 10 || brief.length >= 295) {
      this.props.tipShow({type:"error",msg:"简介在10到300个字符之间"})
      return
    }
    if (!experience) {
      this.props.tipShow({type:"error",msg:"未填写工作经验"})
      return
    }
    if (experience.length > 300) {
      this.props.tipShow({type:"error",msg:"工作经验不能超过300个字符"})
      return
    }
    this.props.addSpeciatity(this,speciality,brief,experience)
  }

  showDeleteImg=(e,index)=>{
    e.target.style.filter = "alpha(opacity=0.8)"
    e.target.style.opacity = "80"
    var me = this
    e.target.onclick=function(){
      me.state.imgs.splice(index,1)
      me.setState({})
    }
  }

  modifyDeleteImg=(e)=>{
    e.target.style.filter = "alpha(opacity=0.8)"
    e.target.style.opacity = "80"
    var me = this
    console.log(me.state.modifyImgs)
    e.target.onclick=function(e){
      e.srcElement.parentNode.parentNode.removeChild(e.srcElement.parentNode)
      for (var i = 0; i < me.state.modifyImgs.length; i++) {
        if(`/img?from=speciality&name=${me.state.modifyImgs[i].key}` == e.target.getAttribute('name')){
          me.state.modifyImgs.splice(i,1)
        }
      }
      me.setState({})
    }
  }

  modifyAddImg=(e)=>{
      if (this.state.modifyImgs.length > 7) {
        this.props.tipShow({type:'error',msg:'只能添加8张图片'})
        return;
      };
      var value = e.target.value
      var filextension=value.substring(value.lastIndexOf("."),value.length);
      filextension = filextension.toLowerCase();
      if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
      {
      this.props.tipShow({type:'error',msg:'文件类型不正确'})
      return;
      }

      var fileUrl = window.URL.createObjectURL(e.target.files[0])

      var div = document.createElement('div')
      div.className = "imgList"
      div.style.backgroundImage = `url(${fileUrl})`

      var divDelete = document.createElement('div')
      divDelete.onmouseout = this.hideDeleteImg
      divDelete.onmouseover = this.modifyDeleteImg
      divDelete.className = "fa fa-trash"
      var key = Date.parse(new Date())
      divDelete.setAttribute('name',key)

      div.appendChild(divDelete)

      e.target.parentNode.parentNode.insertBefore(div,e.target.parentNode)
      this.state.modifyImgs.push({key:key,file:e.target.files[0]})
      this.setState({})
  }

  hideDeleteImg=(e)=>{
    e.target.style.filter = "alpha(opacity=0)"
    e.target.style.opacity = "0"
  }

  addWorks = (e)=>{
      if (this.state.imgs.length > 7) {
        this.props.tipShow({type:'error',msg:'只能添加8张图片'})
        return;
      };
      var value = e.target.value
      var filextension=value.substring(value.lastIndexOf("."),value.length);
      filextension = filextension.toLowerCase();
      if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
      {
      this.props.tipShow({type:'error',msg:'文件类型不正确'})
      return;
      }

      // var imageUrl = window.URL.createObjectURL(e.target.files[0])
      this.state.imgs.push(e.target.files[0])
      this.setState({})
  }

  saveNickname =(e)=>{
    if (!this.refs.nickname.value) {
      this.props.tipShow({type:'error',msg:"昵称不能为空"})
      return
    }
    if (!this.refs.nickname.value.length > 19) {
      this.props.tipShow({type:'error',msg:"昵称不能大于20个字符"})
      return
    }
    modifyNickname({nickname:this.refs.nickname.value}).then(({data})=>{
      if (data.status == 200) {
        this.props.modifyname(this.refs.nickname.value)
        this.setState({
          showNickname:false
        })
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  saveAddress =(e)=>{
    if (!this.refs.address.value) {
      this.props.tipShow({type:'error',msg:"昵称不能为空"})
      return
    }
    if (!this.refs.address.value.length > 19) {
      this.props.tipShow({type:'error',msg:"地址不能大于100个字符"})
      return
    }
    modifyAddress({address:this.refs.address.value}).then(({data})=>{
      if (data.status == 200) {
            this.setState({
              showAddress:false,
              address:this.refs.address.value
            })
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })

  }

  modifySpeciality =(e,name)=>{
    this.state[name] = true
    var items = []
    var data = this.props.myspecialities.text
    for (var i = 0; i < data.length; i++) {
      if(data[i].speciality == name){
        if(data[i].works){
          var arr = data[i].works.split(',')
          for (var i = 0; i < arr.length; i++) {
            items.push({key:arr[i]})
          }
        }
        break;
      }
    }
    this.setState({
      modifyImgs:items
    })
  }

  cancelSpeciality =(e,name)=>{
    this.state[name] = false
    this.setState({})
  }

  saveSpeciality=(e,speciality)=>{

    // console.log(this.state.modifyImgs)

    var brief = this.refs[speciality+'brief'].value
    var experience = this.refs[speciality+'experience'].value

    if (!speciality) {
      this.props.tipShow({type:"error",msg:"专业不为空"})
      return
    }

    if (!brief || brief.length < 10 || brief.length >= 295) {
      this.props.tipShow({type:"error",msg:"简介在10到300个字符之间"})
      return
    }
 
    if (!experience) {
      this.props.tipShow({type:"error",msg:"未填写工作经验"})
      return
    }

    modifySpeciality(this,speciality,brief,experience).then(({data})=>{
      if (data.status == 200) {
        this.state[speciality] = false
        this.setState({})
        this.props.fetchSpeciality()
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  deleteSpeciality=(e,speciality)=>{
    if (!speciality) {
      this.props.tipShow({type:"error",msg:"专业不为空"})
      return
    }

    deleteSpeciality({speciality:speciality}).then(({data})=>{
      if (data.status == 200) {
          var data = this.props.myspecialities.text.concat();
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].speciality == speciality){
              data.splice(i,1)
              break;
            }
          };
          this.props.updateSpeciality(data)
          this.state[speciality] = false
          this.setState({})
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  showAddSpeciality=()=>{

    if (this.props.myspecialities.text.length > 4) {
      this.props.tipShow({type:"error",msg:"只能添加5项专业"})
      return
    };

    this.setState({
      showAddSpeciality:true,
      imgs:[]
    })
  }

  showThisImg =(index,works)=>{
    this.props.imgbrowserShow({currentChoose:index,imgs:works})
  }

  render () {
    // console.log(this.props)
    this.items = [];
    this.props.catelogues.text.map((item,index)=>{
      this.items.push({key:item.childCatelogue,value:item.childCatelogue})
    })
    let nickname = this.props.auth.nickname
    var headSrc = "/public/Headload?member="+this.props.auth.phone
    return (
    <div>
          <div className="basicInfo">
            <div>
              <div>
                <img id="memberinfoHeadImg" src={headSrc} />
                <a className="fa fa-image"><input onChange={this.modifyHead} type="file" /></a>
              </div>
            </div>
              <ul>
                <li><h3><hr /><span>电话</span></h3><p>{this.props.auth.phone}</p></li>
                <li><h3><hr /><span>性别</span></h3><p>{this.state.sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p>{this.state.showNickname && <p><input type="text" ref="nickname" defaultValue={nickname} /> <button className="btn-default" onClick={()=>this.setState({showNickname:false})}>取消</button><button className="btn-success" onClick={this.saveNickname}>保存</button></p>}<a className="btn-normal" onClick={()=>this.setState({showNickname:true})}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>详细地址</span></h3><p>{this.state.address}</p>{this.state.showAddress && <p><input ref="address" type="text" defaultValue={this.state.address} /> <button className="btn-default" onClick={()=>this.setState({showAddress:false})}>取消</button><button className="btn-success" onClick={this.saveAddress}>保存</button></p>}<a className="btn-normal" onClick={()=>this.setState({showAddress:true})}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>专长领域</span></h3></li>
                <li>
                  {this.props.myspecialities.text.map((item,index)=>{
                    var brief = `${item.speciality}brief`;
                    var experience = `${item.speciality}experience`;
                    var works = item.works.split(',')
                    for (var i = 0; i < works.length; i++) {
                         if(works[i])works[i] = `/img?from=speciality&name=${works[i]}`
                    }
                    return <ul key={index}>
                      <li><b>{item.speciality}</b><a onClick={(e)=>this.deleteSpeciality(e,item.speciality)}><i className="fa fa-trash"></i>删除</a><a onClick={(e)=>this.modifySpeciality(e,item.speciality)}><i className="fa fa-edit"></i>修改</a></li>
                      {!this.state[item.speciality] && <li><span>简介&nbsp;:&nbsp;</span><br/><br/>{item.brief}</li>}
                      {!this.state[item.speciality] && <li><span>经验&nbsp;:&nbsp;</span><br/><br/>{item.experience}</li>}
                      {(item.works && !this.state[item.speciality]) && <li>
                      <span>作品展示&nbsp;:&nbsp;</span>
                        <div className="imgShow">
                        {works.map((item,index)=>{
                          if (!item) return;
                          return <div key={index} onClick={(e)=>this.showThisImg(index,works)} style={{backgroundImage:`url(${item})`}}></div>
                            })}
                        </div>
                      </li>}
                      {this.state[item.speciality] && <li className="editLi">
                        <p>简介&nbsp;:&nbsp;</p><button className="btn-success" onClick={(e)=>this.saveSpeciality(e,item.speciality)}>保存</button><button className="btn-default" onClick={(e)=>this.cancelSpeciality(e,item.speciality)}>取消</button>
                        <textarea rows="4" ref={brief} defaultValue={item.brief}></textarea>
                        <br/>
                        <br/>
                        <p>经验&nbsp;:&nbsp;</p><textarea ref={experience} defaultValue={item.experience} rows="10"></textarea>
                        <p>作品展示(最多8张)&nbsp;:&nbsp;</p>{works.map((item,index)=>{
                        if (!item) return;
                        return <div className="imgList" key={index} style={{backgroundImage:`url(${item})`}}>
                          <div onMouseOut={this.hideDeleteImg} onMouseOver={this.modifyDeleteImg} name={item} className="fa fa-trash"></div></div>
                          })}
                        <div className="addDiv">
                          +<input onChange={this.modifyAddImg} type="file" />
                        </div>
                      </li>}
                    </ul>
                  }
                    )}
                    <div style={{marginTop:"30px",clear:'both'}} ><button onClick={this.showAddSpeciality} className="btn-success">+添加专业能力</button>
                    </div>
                </li>
                  {this.state.showAddSpeciality && <div className="addSpeciality">
                  <Select header="选择专业" optionsItems={this.items} ref="speciality" />
                  <br/>
                  <br/>
                  <Textarea header="简介" rows="4" ref="brief" defaultValue="不超过300个字符" />
                  <br/>
                  <Textarea header="经验" rows="10" ref="experience" defaultValue="" />
                  <br/>
                  <div className="works">作品展示(最多8张)</div>
                  {this.state.imgs.map((item,index)=>{
                    var img = window.URL.createObjectURL(item)
                    return <div className="imgList" key={index} style={{backgroundImage:`url(${img})`}}>
                      <div onMouseOut={this.hideDeleteImg} onMouseOver={(e)=>this.showDeleteImg(e,index)} className="fa fa-trash"></div></div>
                      })}
                  <div className="addDiv">
                    +<input onChange={this.addWorks} type="file" />
                  </div>
                    <div className="addSubmit">
                      <button onClick={this.addSpeciatity} className="btn-success pull-right">保存</button>
                      <button onClick={()=>this.setState({showAddSpeciality:false})} className="btn-default pull-right">取消</button>
                    </div>
                  </div>}
              </ul>
          </div>
          <Modal />
    </div>
    )
  }
}

BasicInfo.propTypes = {
  auth: React.PropTypes.object
}
