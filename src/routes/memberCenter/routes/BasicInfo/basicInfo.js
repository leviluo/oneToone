import React, {Component} from 'react'
import Select from '../../../../components/Select'
import Textarea from '../../../../components/Textarea'
import './basicInfo.scss'
import { connect } from 'react-redux'
import {modalShow,modalHide} from '../../../../components/Modal/modules/modal'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {commitHeadImg,getMemberInfo,addSpeciatity,fetchSpeciality} from './modules/basicInfo'
import Modal from '../../../../components/Modal'
import {asyncConnect} from 'redux-async-connect'
import {fetchCatelogue} from '../../../../reducers/category'

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
  {modalShow,modalHide,tipShow,commitHeadImg,addSpeciatity}
)

export default class BasicInfo extends Component {

  state ={
    content: <div></div>,
    address: ''
  }

  componentWillMount =()=>{
    getMemberInfo().then(({data}) => {
        if (data.status==200) {
            this.setState({
              address:data.data[0].address,
              sex:data.data[0].sex
            })
        }else{
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
    data=window.atob(data);
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
    this.props.commitHeadImg(fd)
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

    if (!this.state.speciality) {
      this.props.tipShow({type:"error",msg:"选择一个专业"})
      return
    }
    if (!this.state.brief || this.state.brief.length < 10 || this.state.brief.length >= 295) {
      this.props.tipShow({type:"error",msg:"简介在10到300个字符之间"})
      return
    }
    if (!this.state.experience) {
      this.props.tipShow({type:"error",msg:"未填写工作经验"})
      return
    }

    this.props.addSpeciatity({speciality:this.state.speciality,brief:this.state.brief,experience:this.state.experience})
  }

  specialityChange =(e)=>{
    this.setState({
      speciality:e.target.value
    })
  }

  briefChange = (e)=>{
    this.setState({
      brief:e.target.value
    })
  }

  experienceChange = (e)=>{
    this.setState({
      experience:e.target.value
    })
  }

  showAddSpciality=()=>{

    let items = [];

    this.props.catelogues.text.map((item,index)=>{
      items.push({key:item.childCatelogue,value:item.childCatelogue})
    })
    
    var content = <div>
      <div>
      <Select header="选择专业" optionsItems={items} handleChange={this.specialityChange} />
      </div><div>
      <Textarea header="简介" defaultValue="不超过300个字符" handleTextarea={this.briefChange} />
      </div><div>
      <Textarea header="经验" handleTextarea={this.experienceChange} />
      </div>
      </div>;

    this.props.modalShow({header:"添加新专业",content:content,submit:this.addSpeciatity});
  }

  modifynickname =(e)=>{
    this.setState({
      showNickname:true
    })
  }

  saveNickname =(e)=>{
    this.setState({
      showNickname:false
    })
  }

  modifyAddress =(e)=>{
    this.setState({
      showAddress:true
    })
  }

  saveAddress =(e)=>{
    this.setState({
      showAddress:false
    })
  }

  modifySpeciality =(e,name)=>{
    this.state[name] = true
    this.setState({})
  }

  cancelSpeciality =(e,name)=>{
    this.state[name] = false
    this.setState({})
  }

  saveSpeciality=(e,index)=>{
    console.log(index)
  }

  render () {
    // console.log(this.props.myspecialities)
    
    let nickname = this.props.auth.nickname
    return (
    <div>
          <div className="basicInfo">
            <div>
              <div>
                <img id="memberinfoHeadImg" src="/member/Headload?Math.random()" />
                <a className="fa fa-image"><input onChange={this.modifyHead} type="file" /></a>
              </div>
            </div>
              <ul>
                <li><h3><hr /><span>电话</span></h3><p>{this.props.auth.phone}</p></li>
                <li><h3><hr /><span>性别</span></h3><p>{this.state.sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p>{this.state.showNickname && <p><input type="text" defaultValue={nickname} /> <button className="btn-default" onClick={this.saveNickname}>取消</button><button className="btn-success" onClick={this.saveNickname}>保存</button></p>}<a className="btn-normal" onClick={this.modifynickname}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>详细地址</span></h3><p>{this.state.address}</p>{this.state.showAddress && <p><input type="text" defaultValue={this.state.address} /> <button className="btn-default" onClick={this.saveAddress}>取消</button><button className="btn-success" onClick={this.saveAddress}>保存</button></p>}<a className="btn-normal" onClick={this.modifyAddress}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>专长领域</span></h3></li>
                <li>
                  {this.props.myspecialities.text.map((item,index)=>
                    <ul key={index}>
                      <li><b>{item.speciality}</b><a onClick={(e)=>this.modifySpeciality(e,item.speciality)}><i className="fa fa-edit"></i>修改</a></li>
                      <li><span>简介&nbsp;:&nbsp;</span>{item.brief}</li>
                      <li><span>经验&nbsp;:&nbsp;</span>{item.experience}</li>
                      {this.state[item.speciality] && <li>
                        <span>简介&nbsp;:&nbsp;</span><button className="btn-success" onClick={(e)=>this.saveSpeciality(e,index)}>保存</button><button className="btn-default" onClick={(e)=>this.cancelSpeciality(e,item.speciality)}>取消</button>
                        <textarea rows="4">{item.brief}</textarea>
                        <br/>
                        <br/>
                        <span>经验&nbsp;:&nbsp;</span><textarea rows="10">{item.experience}</textarea>
                      </li>}
                    </ul>
                    )}
                    <button onClick={this.showAddSpciality} className="btn-primary">+添加专业能力</button>
                </li>
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
