import React, { Component, PropTypes } from 'react'
import './select.scss'

export default class Select extends Component{
        render() {
                const{defaultValue,header,handleChange,optionsItems} = this.props;
                return ( < select onChange = { handleChange } defaultValue = {defaultValue} ><option>--{header}--</option>
                            {optionsItems.map((item)=>
                                <option key={item.key} value={item.key}>{item.value}</option>
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