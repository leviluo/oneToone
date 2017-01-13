import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import {chat,submitText,submitImg,getHistory} from './modules/chat'
import './chat.scss'

@connect(
  state=>({chatStatus:state.chat}),
{chat})

export default class Chat extends Component{

  state = {
 
  }

  componentWillMount =()=>{
    
  }

  componentDidMount =(e)=>{
    // this.refs.text.focus()
    this.Chat = findDOMNode(this).getElementsByClassName('chat')[0]
    this.contentBody = findDOMNode(this).getElementsByClassName('content-body')[0]
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
    if (!/[^\t\r\n\s]/.test(this.refs.text.value)) {
      this.refs.text.focus()
      return //过滤只有制表符
    }
    if (this.refs.text.value.length > 280) {
      this.error('文本过长')
      return;
    }
    submitText({text:this.refs.text.value,sendTo:this.props.sendTo}).then(({data}) => {
      if (data.status==200) {
          var str = `<p class="sendFrom"><span>${this.refs.text.value}</span>&nbsp;<span class="name">&nbsp;:&nbsp;${this.props.sendFrom}</span></p>`
          this.Chat.innerHTML += str; 
          this.contentBody.scrollTop = this.contentBody.scrollHeight;
      }else{
          this.error('发送失败')
      }
    }).then(()=>{
          this.refs.text.value = ''
          this.refs.text.focus()
    })
  }

  error =(error)=>{
    this.setState({
      error:error
    })
    var _this = this;
    setTimeout(()=>{
      _this.setState({
      error:'',
      })
    },2000)
  }

  submitImage =(e)=>{
    // 判断文件类型
    var value = e.target.value
    var filextension=value.substring(value.lastIndexOf("."),value.length);
    filextension = filextension.toLowerCase();
    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
    {
      this.error('文件类型不正确')
      return;
    }
    var file = e.target.files[0]
    var fd = new FormData(); 
    fd.append("file", file); 
    fd.append("sendTo",this.props.sendTo)
    var me = this;
    submitImg(fd).then(({data}) => {
      if (data.status==200) {
            var reader = new FileReader();  
            reader.onload = function(e) {  
                var src = e.target.result + "";   
                var str = `<p class="sendFrom img"><img src="${src}"/>&nbsp;<span class="name">&nbsp;:&nbsp;${me.props.sendFrom}</span></p>`
                me.Chat.innerHTML += str; 
                this.contentBody.scrollTop = this.contentBody.scrollHeight;
            }  
            reader.readAsDataURL(file);  
      }else{
          this.error(data.msg)
      }
    })
  }

  checkHistory =()=>{
    getHistory({chatWith:this.props.sendTo}).then((response)=>{
        var data = response.data.data
        var str = ''
        for (var i = 0; i < data.length; i++) {
          if(data[i].send != this.props.sendTo){ //我是发送者
            if (data[i].text) {
              str += `<p class="sendFrom"><span>${data[i].text}</span>&nbsp;<span class="name">&nbsp;:&nbsp;${this.props.sendFrom}</span></p>`
            }else{
              str += `<p class="sendFrom img"><img src="/img?name=${data[i].imgUrl}"/>&nbsp;<span class="name">&nbsp;:&nbsp;${this.props.sendFrom}</span></p>`
            }
          }else{
            if (data[i].text) {
              str += `<p class="sendTo"><span class="name">${this.props.chatTo}&nbsp;:&nbsp;</span>&nbsp;<span>${data[i].text}</span></p>`
            }else{
              str += `<p class="sendTo img"><span class="name">${this.props.chatTo}&nbsp;:&nbsp;</span>&nbsp;<img src="/img?name=${data[i].imgUrl}"/></p>`
            }
          }
        };
        this.Chat.innerHTML = str + this.Chat.innerHTML; 
    })
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
                  <p style={{color:"red"}}>{this.state.error}</p>
                  <div className="chat"></div>
            </div>
            <div className="content-message">
                  <textarea rows="5" ref="text" defaultValue="说些什么吧"></textarea>
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


