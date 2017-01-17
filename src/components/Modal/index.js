import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import {modal} from './modules/modal'
import './Modal.scss'

@connect(
  state=>({modalStatus:state.modal}),
{modal})
export default class Modal extends Component{

  componentWillMount =()=>{

  }

  componentDidMount =(e)=>{

  }

  componentWillReceiveProps =(nextProps)=>{
    // console.log(nextProps.modalStatus)
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if (nextProps.modalStatus.isShow) {
      this.showModal();
    }else{
      this.hideModal();
    }
      return true
  }

  componentDidUpdate =()=>{
    if (this.props.modalStatus.isShow) {
      var ele = findDOMNode(this)
      var element = ele.getElementsByClassName("content")[0];
      var height = window.getComputedStyle(element,null).height.slice(0,-2)
      var width = window.getComputedStyle(element,null).width.slice(0,-2)
      ele.style.height = document.body.scrollHeight + document.body.scrollTop + 'px';
      element.style.top = (document.body.scrollTop + (document.body.clientHeight - height)/2)+'px'
      element.style.left = (document.body.clientWidth - width)/2 + 'px'
    }else{
      this.hideModal()
    }
  }

  showModal =()=>{
    findDOMNode(this).style.display = "block"
    document.body.style.overflow = "hidden"
  }

  hideModal =()=>{
    findDOMNode(this).style.display = "none"
    document.body.style.overflow = "auto"
  }

  static propTypes = {
    // header:React.PropTypes.string.isRequired,
    // content:React.PropTypes.element.isRequired,
    // submit:React.PropTypes.func.isRequired,
  }

  render(){
    const{header,content,submit} = this.props.modalStatus;
    return(
        <div className='modal'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hideModal}>×</div>
              <h2>{header}</h2>
            </div>
            <div className="content-body">
                  {content}
            </div>
            <div className="content-footer">
              <button className="btn-primary" onClick={submit}>提交</button>
            </div>
          </div>
        </div>
      )
  }
}


