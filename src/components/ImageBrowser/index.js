import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import './ImageBrowser.scss'
import {imgbrowser} from './modules'
import {connect} from 'react-redux'

export const imgbrowserShow = imgbrowser

@connect(
  state=>({ImageBrowser:state.imageBrowser}),
{})
export default class ImageBrowser extends Component{

  state={
    src:''
  }

  componentDidUpdate =()=>{
    // console.log(this.props.ImageBrowser)
    if(this.props.ImageBrowser.isShow){
      this.show()
    }
  }

  show =()=>{
      var ele = findDOMNode(this)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.height = document.body.clientHeight + 'px';
      ele.style.top = scrollTop + 'px';
      ele.style.display = "block"
      var element = ele.getElementsByClassName('content')[0]
      element.style.top = scrollTop+'px'
      document.body.style.width = parseInt(window.getComputedStyle(document.body,null).width.slice(0,-2)) + 'px'
      document.body.style.overflow = "hidden"
  }

  close=()=>{
    var ele = findDOMNode(this)
    ele.style.display = "none"
    document.body.style.overflow = "auto"
  }

  componentWillReceiveProps=(nextProps)=>{
    this.setState({
      src:nextProps.ImageBrowser.imgs[nextProps.ImageBrowser.currentChoose],
      currentChoose:nextProps.ImageBrowser.currentChoose
    })
  }

  up=()=>{
    if (this.state.currentChoose == 0) {return};
    this.setState({
      src:this.props.ImageBrowser.imgs[this.state.currentChoose-1],
      currentChoose:this.state.currentChoose - 1
    })
  }

  next=()=>{
    if (this.state.currentChoose == this.props.ImageBrowser.imgs.length-1) {return};
    this.setState({
      src:this.props.ImageBrowser.imgs[this.state.currentChoose+1],
      currentChoose:this.state.currentChoose + 1
    })
  }

  render(){
    // console.log(this.state)
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

