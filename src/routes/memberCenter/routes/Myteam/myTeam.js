import React, {Component} from 'react'
import './myTeam.scss'
import { connect } from 'react-redux'
// import {modalShow,modalHide} from '../../../../components/Modal/modules/modal'
// import { tipShow } from '../../../../components/Tips/modules/tips'
// import {commitHeadImg,getMemberInfo} from './modules/basicInfo'

@connect(
  state => ({
    auth:state.auth,
    }),
  {}
)

export default class Myteam extends Component {

  state ={

  }

  render () {
    let nickname = this.props.auth.nickname
    return (
    <div>
      team
    </div>
    )
  }
}

Myteam.propTypes = {
  auth: React.PropTypes.object
}
