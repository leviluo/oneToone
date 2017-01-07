import React, { Component, PropTypes } from 'react'
import './select.scss'

export default class Select extends Component{


        getValue=()=>{
            return this.refs.myValue.value
        } 

        render() {
                const{defaultValue,header,handleChange,optionsItems} = this.props;
                return ( < select onChange = { handleChange } ref="myValue" defaultValue = {defaultValue} ><option>--{header}--</option>
                            {optionsItems.map((item,index)=>
                                <option key={index} value={item.key}>{item.value}</option>
                            )}
                    </select>
                )
            }
}


Select.PropTypes = {
    header:React.PropTypes.string.isRequired,
    handleChange:React.PropTypes.func.isRequired,
    defaultValue:React.PropTypes.string,
    optionsItems:React.PropTypes.array
}

