import React, { Component, PropTypes } from 'react'
import './radio.scss'

export default class radioBox extends Component{

        getValue = ()=>{
            return this.refs.radio.value
        }

        render() {
            const {items,header} = this.props;
            let itemss = [];
            let name = Math.random()
            for (var i = 0; i < items.length; i++) {
                let flag = this.props.defaultValue == items[i].key ? true : false;
                itemss.push(<span key={i}><input type="radio" name={name} ref="radio" defaultChecked={flag} value={items[i].key} onChange={this.props.handleRadio}/>{items[i].value}</span>)
                }
                return ( <div className="radio">
                            <label>{header}{this.props.indeed && <span className="pull-left" style={{color:'red'}}>*</span>}:</label>
                            <span>{itemss}</span>
                        </div>
                )
            }
}

radioBox.PropTypes = {
    items: React.PropTypes.array,
    header: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
}