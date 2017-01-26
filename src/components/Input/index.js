import React, { Component, PropTypes } from 'react'
import './Input.scss'

export default class Input extends Component{

        render() {
                const{defaultValue,header,handleChange,indeed,placeholder,type} = this.props;
                return ( < div className = "input-group">
                    < label > { header }{indeed && <span>*</span>}:< /label>
                    < input placeholder={placeholder} type={type} onChange = { handleChange } defaultValue = {defaultValue} />
                    < /div >
                )
            }
}

Input.PropTypes = {
    // header:React.PropTypes.string.isRequired,
    // handleChange:React.PropTypes.func.isRequired,
    // defaultValue:React.PropTypes.string,
    // indeed:React.PropTypes.bool,
    // palceholder:React.PropTypes.string,
    // type:React.PropTypes.string,
}