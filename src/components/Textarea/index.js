import React, { Component, PropTypes } from 'react'
import './Input.scss'

export default class Input extends Component{

        render() {
            console.log(this.props)
                const{defaultValue,header,handleChange,indeed,palceholder,type} = this.props;
                return ( < div className = "textarea-group">
                    < label > { header }{indeed && <span>*</span>}:< /label>
                    < input palceholder={palceholder} type={type} onChange = { handleChange } defaultValue = {defaultValue} />
                    < /div >
                )
            }
}

Input.PropTypes = {
    header:React.PropTypes.string.isRequired,
    handleChange:React.PropTypes.func.isRequired,
    defaultValue:React.PropTypes.string,
    indeed:React.PropTypes.bool,
    palceholder:React.PropTypes.string,
    type:React.PropTypes.string,
}