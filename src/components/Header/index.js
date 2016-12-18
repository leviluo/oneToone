import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import {loginOut,isAuth} from './modules/auth'
import Location from '../Location'
import {connect} from 'react-redux'
import './Header.scss'
import 'font-awesome/scss/font-awesome.scss'

@connect(
  state=>({auth:state.auth}),
{isAuth,loginOut})

export default class Header extends Component{

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth()
  }

  static contextTypes = {
      router: React.PropTypes.object.isRequired
  };


  loginOut =()=>{
    this.props.loginOut(this.context.router);
  }

  render(){
    // console.log(this.props)
    const{auth} = this.props;
    return(
        <div className='menu'>
          <nav>
            <h1><IndexLink to="/" className="brand">OneToOne</IndexLink></h1>
            <h4>专业一对一服务提供平台</h4><Location />
            <span className="headerLeft">
             {!auth.isAuth && <span><Link to='/login'>登录</Link>
             <Link to='/register'>注册</Link>
             </span>}
             {auth.isAuth && <span>欢迎 {auth.nickname}&nbsp;<Link to="/memberCenter"><i className="fa fa-user-circle"></i>&nbsp;个人中心</Link><a onClick={this.loginOut}>退出
             </a></span>}
             </span>
          </nav>
        </div>
      )
  }
}

