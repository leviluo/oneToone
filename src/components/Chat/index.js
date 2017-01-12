import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import {chat,submitText,submitImg} from './modules/chat'
import './chat.scss'

@connect(
  state=>({chatStatus:state.chat}),
{chat,submitText,submitImg})

export default class Chat extends Component{

  state = {
 
  }

  componentWillMount =()=>{
    
  }

  componentDidMount =(e)=>{
    // this.refs.text.focus()

  }

  componentWillReceiveProps =(nextProps)=>{
    //清空留言板
    var ele = findDOMNode(this).getElementsByClassName('chat')[0].getElementsByTagName('p')
    var num = ele.length
    for (var i = 0; i < num; i++) {
        ele[0].parentNode.removeChild(ele[0])
    }
    this.refs.text.value = '说些什么吧'

    setTimeout(()=>{  //定位输入焦点
    this.refs.text.focus()
    },10)

  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if (nextProps.chatStatus.isShow) {
      this.showchat();
    }else{
      this.hidechat();
    }
      return true
  }

  componentDidUpdate =()=>{
    if (this.props.chatStatus.isShow) {
      var ele = findDOMNode(this)
      var height = window.getComputedStyle(ele,null).height.slice(0,-2)
      ele.style.top = document.body.scrollTop + document.body.clientHeight - height+'px'
    }else{
      this.hidechat()
    }
  }

  showchat =()=>{
    findDOMNode(this).setAttribute('class','showChat')
    findDOMNode(this).style.display = "block"
    var ele = findDOMNode(this) 
    window.onscroll = function (){
      var height = window.getComputedStyle(ele,null).height.slice(0,-2)
      ele.style.top = document.body.scrollTop + document.body.clientHeight - height+'px'
    }
  }

  hidechat =()=>{
    findDOMNode(this).setAttribute('class','')
    findDOMNode(this).style.display = "none"
    window.onscroll = null
  }

  static propTypes = {
    chatTo:React.PropTypes.string.isRequired,
    sendTo:React.PropTypes.string.isRequired,
  }

  submitText =()=>{
    console.log(this.refs.text.value)
    if (!this.refs.text.value) return
    this.props.submitText({text:this.refs.text.value,sendTo:this.props.sendTo},findDOMNode(this).getElementsByClassName('chat')[0],this.props.sendFrom)
  }

  submitImage =(e)=>{
    // 判断文件类型
    var value = e.target.value
    var filextension=value.substring(value.lastIndexOf("."),value.length);
    filextension = filextension.toLowerCase();
    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
    {
      var ele = findDOMNode(this).getElementsByClassName('chat')[0];
      ele.innerHTML += `<p style="color:red">文件类型不正确</p>`
      return;
    }

    var fd = new FormData(); 
    fd.append("file", e.target.files[0]); 
    fd.append("sendTo",this.props.sendTo)

    this.props.submitImg(fd,findDOMNode(this).getElementsByClassName('chat')[0],this.props.sendFrom,e.target.files[0])
  }

  checkHistory =()=>{
    alert('')
  }

  send =(e)=>{
    if(e.keyCode==13){
      this.submitText()
    }
  }

  render(){
    const{chatTo} = this.props;
    return(
        <div id='chat'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hidechat}>×</div>
              <h3>{`给${chatTo}的留言`}</h3>
            </div>
            <div className="content-body">
                  <p><a onClick={this.checkHistory}>查看历史消息...</a></p>
                  <div className="chat">

                  </div>
            </div>
            <div className="content-message">
                  <textarea rows="5" ref="text" onKeyDown={this.send} defaultValue="说些什么吧"></textarea>
            </div>
            <div className="content-footer">
              <a className="fa fa-image"><input onChange={this.submitImage} type="file" /></a>
              <button className="btn-success" onClick={this.submitText}>发送</button>
            </div>
          </div>
        </div>
      )
  }
}


