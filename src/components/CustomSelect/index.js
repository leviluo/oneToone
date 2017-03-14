import React, { Component, PropTypes } from 'react'
import './index.scss'

export default class customselect extends Component{

        state = {
            ifShow:false,
            defaultValue : "请选择"
        }

        checkOne = (value)=>{
            this.setState({
                defaultValue:value
            })
        }

        render() {
                const{items} = this.props;
                return ( <article id="customeselect" >
                          <label type="text" onClick={this.state.ifShow ? false :true}>{this.state.defaultValue}</label><b>¨‹</b>
                          {this.state.ifShow && <ul>
                            {items.map((item,index)=>
                                <li>
                                    <ul>
                                        <li>{item.key}</li>
                                        {item.lists.map((item,index)=>{
                                            <li><a href="javascript:;" onClick={()=>this.checkOne(item.value)}>{item.value}</a></li>
                                        })}
                                    </ul>
                                </li>
                                )}
                          </ul>}
                          </article>
                )
            }
}

customselect.PropTypes = {
   
}