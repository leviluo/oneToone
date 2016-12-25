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
    // var ele = findDOMNode(this)
    // var element = ele.getElementsByClassName("content")[0];
    // setTimeout(()=>{
    //   var height = window.getComputedStyle(element,null).height.slice(0,-2)
    //   var width = window.getComputedStyle(element,null).width.slice(0,-2)
    //   element.style.top = (document.body.clientHeight - height)/2+'px'
    //   element.style.left = (document.body.clientWidth - width)/2 + 'px'
    // },10)
  }

  componentWillReceiveProps =(nextProps)=>{
    console.log(nextProps.modalStatus)
    // if(nextProps.modalStatus.isShow)
    // this.props.modal(false)
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
    console.log(this.props.modalStatus)
    if (this.props.modalStatus.isShow) {
      var ele = findDOMNode(this)
      var element = ele.getElementsByClassName("content")[0];
      var height = window.getComputedStyle(element,null).height.slice(0,-2)
      var width = window.getComputedStyle(element,null).width.slice(0,-2)
      ele.style.height = document.body.clientHeight + document.body.scrollTop + 'px';
      element.style.top = (document.body.scrollTop + (document.body.clientHeight - height)/2)+'px'
      element.style.left = (document.body.clientWidth - width)/2 + 'px'
    }else{
      this.hideModal()
    }
  }

  showModal =()=>{
    findDOMNode(this).style.display = "block"
  }

  hideModal =()=>{
    findDOMNode(this).style.display = "none"
  }

  static propTypes = {
    header:React.PropTypes.string.isRequired,
    content:React.PropTypes.element.isRequired,
    submit:React.PropTypes.func.isRequired,
  }

  render(){
    console.log(this.props)
    const{header,content,submit} = this.props;
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
              <button className="btn-primary" onClick={submit}>确定</button>
            </div>
          </div>
        </div>
      )
  }
}


