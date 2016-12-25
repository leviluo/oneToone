import React, {Component} from 'react'
import './basicInfo.scss'
import { connect } from 'react-redux'
import Modal from '../../../../components/Modal'
import {modal} from '../../../../components/Modal/modules/modal'

@connect(
  state => ({
    auth:state.auth,
    }),
  {modal}
)

export default class BasicInfo extends Component {

  state ={
    content: <div></div>
  }

  inputImage = ()=>{
    console.log("000")
  }

  modifyHead =()=>{
    this.setState({
      content:<div>
        <img src="/favicon.ico" />
        <span className="inputImage">
            <input name="file" type="file" onChange={this.inputImage} />
            <button name="image" className='fa fa-image'></button>
        </span>
        <span>选择图片</span>
      </div>
    })
    this.props.modal(true)
  }

  modifyHeadSubmit =()=>{
    console.log("000")
  }

  render () {
    let nickname = this.props.auth.nickname
    return (
    <div>
          <table className="basicInfo">
          <tbody>
          <tr><td>头像</td><td><img src="/favicon.ico" /><a onClick={this.modifyHead}>修改</a></td></tr>
          <tr><td>昵称</td><td>{nickname}</td></tr>
          <tr><td colSpan="2"><button className="btn-primary">修改密码</button></td></tr>
          </tbody>
          </table>
          <Modal header="修改头像" content={this.state.content} submit={this.modifyHeadSubmit} />
    </div>
    )
  }
}

BasicInfo.propTypes = {
  auth: React.PropTypes.object
}

