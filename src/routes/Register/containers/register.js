import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './register.scss'
import { connect } from 'react-redux';
import { fetchRegister } from '../modules/register'
import { tipShow } from '../../../components/Tips/modules/tips'
// import {browserHistory} from 'react-router'
@connect(
  state => ({
    register: state.register,
    mylocation: state.mylocation.text
    }),
  {tipShow,fetchRegister}
)
export default class Register extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  submit =()=>{

    var pattern = /^[1][34578][0-9]{9}$/;
    if (!pattern.test(this.refs.phone.value)) {
        this.props.tipShow({type:"error",msg:'手机号格式不正确'})
        return;
    };

    pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_\.]{6,20}$/;
    if (!pattern.test(this.refs.password.value)){
      this.props.tipShow({type:"error",msg:"密码格式不正确"})
      return
    }

    if (!this.refs.nickname.value) {
      this.props.tipShow({type:"error",msg:"请填写昵称"})
      return
    }

    if (!this.refs.code.value) {
      this.props.tipShow({type:"error",msg:"请填写验证码"})
      return
    }

    let address = this.props.mylocation.content ? this.props.mylocation.content.address :'';
    this.props.fetchRegister({phone:this.refs.phone.value,password:this.refs.password.value,nickname:this.refs.nickname.value,code:this.refs.code.value,location:address},this.context.router)
  }

  render () {
    // console.log(this.props) 
    return (
      <div className="registerContainer">
        <Helmet title='注册' />
        <h2>注册</h2>
        <hr />
        <div name="content">
        <div>
            <input type="text" ref="phone" placeholder="手机号"/>
        </div>
        <br />
        <div>
            <input type="password" ref="password" placeholder="密码（6-20位字母数字_,无空格）"/>
        </div>
        <br />
        <div>
            <input type="text" ref="nickname" placeholder="昵称"/>
        </div>
        <br />
        <div>
            <input name="code" type="text" ref="code" placeholder="验证码（6位）"/><button className="btn-primary codebtn">发送</button>
        </div>
        <div>
            <button className="btn-primary" type="submit" onClick={this.submit}>提交</button>
        </div>
        </div>
      </div>
    )
  }
}

Register.propTypes = {
  // zen: React.PropTypes.object.isRequired
}