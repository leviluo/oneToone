import React, {Component} from 'react'
import './basicInfo.scss'
import { connect } from 'react-redux'
import Modal from '../../../../components/Modal'
import {modal} from '../../../../components/Modal/modules/modal'

@connect(
  state => ({
    auth:state.auth,
    }),
  {modal}
)

export default class BasicInfo extends Component {

  state ={
    content: <div></div>
  }

  inputImage = ()=>{
    // console.log("000")
  }

  componentWillMount =()=>{
    // console.log('000')
    // this.setState({
    //   content: <div id="headerEdit" style={{width:"100%",height:'200px',background:'url(/banner1.jpg)'}}>
    //             <div></div>
    //             <div></div>
    //             <div><div></div></div>
    //             <div></div>
    //             <div></div>
    //           </div>
    // })
    // this.props.modal(true)
    
  }

  modifyHead =()=>{
    this.setState({
      content: 
      <div id="headerEdit" style={{width:"400px",height:'250px',margin:'0 auto',backgroundImage:'url(/banner1.jpg)',backgroundPosition:'center',backgroundSize:'cover'}}>
                <div style={{width:'400px',height:'75px',float:'left',margin:'0',background:'rgba(255,255,255,0.4)'}}></div>
                <div style={{width:'150px',height:'100px',float:'left',margin:'0',background:'rgba(255,255,255,0.4)'}}></div>
                <div style={{width:'100px',height:'100px',float:'left',margin:'0',cursor:'move'}} onMouseDown={this.start} onMouseUp={this.end} onMouseOut={this.end} ><div onMouseDown={this.startDrag} onMouseUp={this.end} onMouseOut={this.end} style={{width:'10px',height:'10px',background:'green',margin:'90px 0 0 90px',cursor:'nw-resize'}}></div></div>
                <div style={{width:'150px',height:'100px',float:'left',margin:'0',background:'rgba(255,255,255,0.4)'}}></div>
                <div style={{width:'400px',height:'75px',float:'left',margin:'0',background:'rgba(255,255,255,0.4)'}}></div>
      </div>
    })
    this.props.modal(true)
  }

  modifyHeadSubmit =()=>{
    console.log("000")
  }

  editInit=(e)=>{

    var headerEdit = document.getElementById('headerEdit')

    if(!this.divtop)this.divtop = headerEdit.getElementsByTagName('div')[0]
    if(!this.divcenterLeft)this.divcenterLeft = headerEdit.getElementsByTagName('div')[1]
    if(!this.divcenter)this.divcenter = headerEdit.getElementsByTagName('div')[2]
    if(!this.divcenterRight)this.divcenterRight = headerEdit.getElementsByTagName('div')[4]
    if(!this.divottom)this.divottom = headerEdit.getElementsByTagName('div')[5]
  }

  start =(e)=>{
    this.editInit()
    var startX = e.clientX;
    var startY = e.clientY; 

    document.onmousemove = (e)=>{
         var diffX = e.clientX - startX
         var diffY = e.clientY - startY
         var divtopH = Math.min(150,parseInt(this.divtop.style.height.slice(0,-2))+ diffY)
         var divleftW = Math.min(300,parseInt(this.divcenterLeft.style.width.slice(0,-2))+ diffX)
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

  move =(e)=>{
    // console.log("00")
    // console.log(this.isMove)
    if (!this.isMove) return;
    console.log("11")
    var diffX = e.clientX - this.startX
    var diffY = e.clientY - this.startY
     var ob = document.getElementById("imgEdit")
      console.log(e.target)
      console.log(ob)
    var currentStartX = window.getComputedStyle(ob).left.slice(0,-2);
    var currentStartY = window.getComputedStyle(ob).top.slice(0,-2);
      console.log(currentStartX)
      console.log(currentStartY)
    // if((e.clientX - e.offsetX) <= 200){
    //     ob.style.left = 0;
    //     return
    // }
    // if((e.clientY - e.offsetY) <= 50){
    //     ob.style.top = 0;
    //     return
    // }

    ob.style.left = parseInt(currentStartX) + diffX + 'px'
    ob.style.top = parseInt(currentStartY) + diffY + 'px'

    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  startDrag =(e)=>{
    e.stopPropagation()
    this.editInit()
    var startX = e.clientX;
    // var startY = e.clientY; 
    var me = e.target;

    document.onmousemove = (e)=>{
         var diffX = e.clientX - startX
      // console.log(diffX)
      // console.log(this.divcenter.style.height)
         // var diffY = e.clientY - startY
        var newH = Math.min(parseInt(this.divcenter.style.height.slice(0,-2)) + diffX,250-e.offsetY)
        var newW = Math.min(parseInt(this.divcenter.style.width.slice(0,-2)) + diffX,400-e.offsetX)
        if (newH == (250-e.offsetY) || newW == (400-e.offsetX)) {
          return
        }
        // console.log(diffX)

        this.divcenterLeft.style.height = newH + 'px'

        this.divcenter.style.width = newH + 'px'
        this.divcenter.style.height = newH + 'px'

        this.divcenterRight.style.height = newH + 'px'
        this.divcenterRight.style.width =  parseInt(this.divcenterRight.style.width.slice(0,-2)) - diffX + 'px'

        // console.log(me)

        // me.style.marginTop = 90 + diffX + 'px'
        // me.style.marginleft = 90 + diffX + 'px'

         startX = e.clientX;
         // startY = e.clientY;
    }
  }

  end =(e)=>{
    document.onmousemove = null;
  }

  render () {
    let nickname = this.props.auth.nickname
    return (
    <div>
          <table className="basicInfo">
            <tbody>
            <tr><td>头像</td><td><img src="/favicon.ico" /><a onClick={this.modifyHead}>修改</a></td></tr>
            <tr><td>昵称</td><td>{nickname}</td></tr>
            <tr><td colSpan="2"><button className="btn-primary">修改密码</button></td></tr>
            </tbody>
          </table>
          <Modal header="修改头像" type="提交" content={this.state.content} submit={this.modifyHeadSubmit} />
    </div>
    )
  }
}

BasicInfo.propTypes = {
  auth: React.PropTypes.object
}

