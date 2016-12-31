import React, { Component, PropTypes } from 'react'
import './headEdit.scss'
import {findDOMNode} from 'react-dom'

export default class HeadEdit extends Component{

  hideModal =()=>{
    findDOMNode(this).style.display = "none"
  }

  static propTypes = {
    // submit:React.PropTypes.func.isRequired,
  }

  componentDidUpdate =()=>{
      var ele = findDOMNode(this)
      var element = ele.getElementsByClassName("content")[0];
      var height = window.getComputedStyle(element,null).height.slice(0,-2)
      var width = window.getComputedStyle(element,null).width.slice(0,-2)
      ele.style.height = document.body.clientHeight + document.body.scrollTop + 'px';
      element.style.top = (document.body.scrollTop + (document.body.clientHeight - height)/2)+'px'
      element.style.left = (document.body.clientWidth - width)/2 + 'px'
  }

  end =(e)=>{
    document.onmousemove = null;
  }

  start =(e)=>{

    var headerEdit = document.getElementById('headerEdit')

    this.divtop = headerEdit.getElementsByTagName('div')[0]
    this.divcenterLeft = headerEdit.getElementsByTagName('div')[1]
    this.divcenter = headerEdit.getElementsByTagName('div')[2]
    this.divcenterRight = headerEdit.getElementsByTagName('div')[4]
    this.divottom = headerEdit.getElementsByTagName('div')[5]

    this.startX = e.clientX;
    this.startY = e.clientY; 

    document.onmousemove = (e)=>{
         var diffX = e.clientX - this.startX
         var diffY = e.clientY - this.startY
         var divtopH = Math.min(150,parseInt(this.divtop.style.height.slice(0,-2))+ diffY)
         var divleftW = Math.min(300,parseInt(this.divcenterLeft.style.width.slice(0,-2))+ diffX)
         divleftW = Math.max(0,divleftW)
         this.divtop.style.height = divtopH + 'px';
         this.divcenterLeft.style.width = divleftW + 'px'
         this.divcenterRight.style.width = 300 - divleftW + 'px'
         this.divottom.style.height = (150-divtopH) + 'px';
         this.startX = e.clientX;
         this.startY = e.clientY;
    }
  }

  render(){
    return(
        <div className='modal'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hideModal}>×</div>
              <h2>修改头像</h2>
            </div>
            <div className="content-body">
                        <table style={{backgroundImage:'url(/banner1.jpg)'}} cellSpacing="0">
                        <tbody>
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td><div></div></td>
                          <td onMouseDown={this.start} onMouseUp={this.end} onMouseOut={this.end}><div><div></div></div></td>
                          <td><div></div></td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                        </tbody>
                        </table>
            </div>
            <div className="content-footer">
              <button className="btn-primary" onClick={this.props.submit}>提交</button>
            </div>
          </div>
        </div>
      )
  }
}


