import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
// import {modalShow,modalHide} from '../../../../components/Modal/modules/modal'
// import { tipShow } from '../../../../components/Tips/modules/tips'
// import {commitHeadImg,getMemberInfo} from './modules/basicInfo'

import {messageList} from './modules/myMessage'

@connect(
  state => ({
    auth:state.auth,
    }),
  {}
)

export default class myMessage extends Component {

  state ={
    
  }

  componentWillMount =()=>{
    messageList().then(({data})=>{
      console.log(data)
    })
  }

  render () {
    let nickname = this.props.auth.nickname
    return (
    <div>
      <div className="messageContent">
        
      </div>
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}
