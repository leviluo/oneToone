import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
// import { tipResult } from './modules/Tips';

import "./Tips.scss"

@connect(
  state => ({
        result:state.mytips.text,
    }),
  {}
)
export default class Tip extends Component {

    componentWillMount = () => {
        // console.log("componentWillMount")
        
    }
    
    componentDidUpdate = (e) => {
        findDOMNode(this).style.left = ((document.body.clientWidth-window.getComputedStyle(findDOMNode(this),null).width.slice(0,-2)) / 2) + 'px';
    }

    componentWillUpdate() {

    }

    shouldComponentUpdate(nextProps){
        if(nextProps==this.props)return false
        let that = this;
        if(nextProps.result.msg) {
            if (nextProps.result.type=="success") {
                this.showTip("#008B00")
            }else{
                this.showTip("rgb(200,0,0)")
            }
            setTimeout(()=>{
            that.hideTip();
            }, 2000)
        }else{
            return false
        }
        return true
    }

    componentWillReceiveProps =()=>{
        // console.log("componentWillReceiveProps")
        // console.log(this.props)
    }

    hideTip = () =>{
        findDOMNode(this).style.display = "none";
    }

    showTip = (color)=>{
        findDOMNode(this).style.display = "block";
        findDOMNode(this).style.background = color;
    }

    static propTypes = {
        result: React.PropTypes.object.isRequired,
    }

    render() {
        console.log("tips")
        return ( 
            < div id = "tips" > {this.props.result.msg} </div >
        )
    }
}

