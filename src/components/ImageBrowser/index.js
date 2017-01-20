import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
// import {connect} from 'react-redux'
// import * as actions from './modules/modal'
import './ImageBrowser.scss'

// @connect(
//   // state=>({modalStatus:state.modal}),
// {})
export default class ImageBrowser extends Component{

  state={
    src:''
  }

  componentDidUpdate =()=>{
      var ele = findDOMNode(this)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.height = document.body.clientHeight + 'px';
      ele.style.top = scrollTop + 'px';
      ele.style.display = "block"
      var element = ele.getElementsByClassName('content')[0]
      element.style.top = scrollTop+'px'
      document.body.style.overflow = "hidden"
  }

  shouldComponentUpdate =(nextProps)=>{
    if (!nextProps.imgs || nextProps.currentChoose == undefined) {return false};
    return true
  }

  close=()=>{
    var ele = findDOMNode(this)
    ele.style.display = "none"
    document.body.style.overflow = "auto"
  }

  componentWillReceiveProps=(nextProps)=>{
    if(!nextProps.imgs)return
    this.setState({
      src:`/img?from=speciality&name=${nextProps.imgs[nextProps.currentChoose]}`,
      currentChoose:nextProps.currentChoose
    })
  }

  up=()=>{
    if (this.state.currentChoose == 0) {return};
    this.setState({
      src:`/img?from=speciality&name=${this.props.imgs[this.state.currentChoose-1]}`,
      currentChoose:this.state.currentChoose - 1
    })
  }

  next=()=>{
    if (this.state.currentChoose == this.props.imgs.length-1) {return};
    this.setState({
      src:`/img?from=speciality&name=${this.props.imgs[this.state.currentChoose+1]}`,
      currentChoose:this.state.currentChoose + 1
    })
  }

  render(){
    console.log(this.state.src)
    return(
        <div className='ImageBrowser'>
          <div className='content'>
            <div>
              <button onClick={this.up} >&lt;</button>
              <button onClick={this.next} >&gt;</button>
            </div>
            <div>
              <img src={this.state.src} alt=""/>
              <button className="close" onClick={this.close} >×</button>
            </div>
          </div>
        </div>
      )
  }
}

