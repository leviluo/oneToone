import React, { Component, PropTypes } from 'react'
import './index.scss'

export default class Textarea extends Component{
        render() {
                const{defaultValue,header,handleTextarea} = this.props;
                return ( < div className = "textarea-group">
                    < label > { header }:< /label>
                        <textarea defaultValue={this.props.defaultValue} onChange={this.props.handleTextarea} cols="30" rows="10"></textarea>
                    < /div >
                )
            }
}

Textarea.PropTypes = {
    header:React.PropTypes.string.isRequired,
    handleTextarea:React.PropTypes.func.isRequired,
    defaultValue:React.PropTypes.string
}