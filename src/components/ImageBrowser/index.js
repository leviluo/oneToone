import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import './ImageBrowser.scss'
import {imgbrowser} from './modules'
import {connect} from 'react-redux'
import loading from './assets/loading.gif'
import {tipShow} from '../Tips/modules/tips'

export const imgbrowserShow = imgbrowser

@connect(
  state=>({ImageBrowser:state.imageBrowser}),
{tipShow})
export default class ImageBrowser extends Component{

  state = {
    currentChoose:0
  }
 
  componentDidUpdate =()=>{
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
    // console.log(ele)
    ele.style.display = "none"
    document.body.style.overflow = "auto"
    document.body.style.width = 'auto'   //在打开modal之后，关闭了modal，得改为自动，网页才会自动调整大小
    this.refs.src.src = loading
  }

  componentWillReceiveProps=(nextProps)=>{
    this.setState({
      currentChoose:nextProps.ImageBrowser.currentChoose
    })
    this.refs.src.src = nextProps.ImageBrowser.imgs[nextProps.ImageBrowser.currentChoose]
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if(nextProps.ImageBrowser.imgs.length == 0) return false
    return true
  }

  up=()=>{
    if (this.state.currentChoose == 0) {
      this.props.tipShow({type:"error",msg:"已经是第一张了"})
      return
    };
    this.setState({
      currentChoose:this.state.currentChoose - 1
    })
    this.refs.src.src = this.props.ImageBrowser.imgs[this.state.currentChoose-1]
  }

  next=()=>{
    if (this.state.currentChoose == this.props.ImageBrowser.imgs.length-1) {
      this.props.tipShow({type:"error",msg:"已经是最后一张了"})
      return
    };
    this.setState({
      currentChoose:this.state.currentChoose + 1
    })
    this.refs.src.src = this.props.ImageBrowser.imgs[this.state.currentChoose+1]
  }

  go =(e,index)=>{
    this.setState({
      currentChoose:index
    })
    this.refs.src.src = this.props.ImageBrowser.imgs[index]
  }

  render(){
    // console.log(this.state)
    return(
        <div className='ImageBrowser'>
          <div className='content'>
            <div className="page">
              <button onClick={this.up} >&lt;</button>
            </div>
            <div>
              <img ref="src" alt=""/>
              <div className="photoLists">
                <div className="pageUp" onClick={this.up} >&lt;</div>
              <button className="close" onClick={this.close} >×</button>
                {this.props.ImageBrowser.imgs.map((item,index)=>{
                  if(index == this.state.currentChoose){
                    var color = "#ff7f00"
                  }else{
                    var color = "#efefef"
                  }
                  var date = new Date(item.createdAt)
                  var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
                  return <div onClick={(e)=>this.go(e,index)} key={index} style={{backgroundImage:`url(${item})`,border:`2px solid ${color}`}} className="imgShows"></div>
                })}
              {this.props.ImageBrowser.likeFunc && <button className="like" onClick={(e)=>this.props.ImageBrowser.likeFunc(e,this.props.ImageBrowser.imgs[this.state.currentChoose].match(/[\d]+/)[0])} ><i className="fa fa-heart"></i></button>}
                <div className="pageDown" onClick={this.next} >&gt;</div>
              </div>
            </div>
            <div className="page">
              <button onClick={this.next} >&gt;</button>
            </div>
          </div>
        </div>
      )
  }
}

