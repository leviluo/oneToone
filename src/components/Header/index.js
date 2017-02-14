import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import {loginOut,isAuth} from '../../reducers/auth'
import Location from '../Location'
import {connect} from 'react-redux'
import './Header.scss'
import 'font-awesome/scss/font-awesome.scss'

@connect(
  state=>({auth:state.auth}),
{loginOut,isAuth})

export default class Header extends Component{

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth()
  }

  loginOut =()=>{
    this.props.loginOut(this.context.router);
  }

  render(){
    // console.log(this.props)
    const{auth} = this.props;
    return(
        <header>
          <nav>
          <span className="pull-left">
            <h1 ><IndexLink to="/" className="brand">OneOne</IndexLink></h1>
            <h4 >各个身怀绝技</h4><Location />
          </span>
              <Link className="item pull-left" to="/"><span>首页</span></Link>
              <Link className="item pull-left" to="/Organization"><span>社团</span></Link>
            <span className="headerRight">
             {!auth.isAuth && <span><Link to='/login'>登录</Link>
             <Link to='/register'>注册</Link>
             </span>}
             {auth.isAuth && <span><a onClick={this.loginOut}>退出</a>
             <Link to="/memberCenter"><i className="fa fa-user-circle"></i>&nbsp;{auth.nickname} 的个人中心</Link></span>}
             </span>
          </nav>
        </header>
      )
  }
}

