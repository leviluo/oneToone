import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import {chat} from './modules/chat'
import './chat.scss'

@connect(
  state=>({chatStatus:state.chat}),
{chat})

export default class Chat extends Component{

  componentWillMount =()=>{

  }

  componentDidMount =(e)=>{

  }

  componentWillReceiveProps =(nextProps)=>{
    // console.log(nextProps.chatStatus)
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
    header:React.PropTypes.string.isRequired,
    content:React.PropTypes.element.isRequired,
    submit:React.PropTypes.func.isRequired,
  }

  render(){
    const{header,content,submit,type} = this.props;
    return(
        <div id='chat'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hidechat}>×</div>
              <h3>{header}</h3>
            </div>
            <div className="content-body">
                  <p><a href="">查看历史消息...</a></p>
                  {content}
            </div>
            <div className="content-message">
                  <textarea rows="5"></textarea>
            </div>
            <div className="content-footer">
              <i className="fa fa-image"></i>
              <button className="btn-success" onClick={submit}>发送</button>
            </div>
          </div>
        </div>
      )
  }
}


