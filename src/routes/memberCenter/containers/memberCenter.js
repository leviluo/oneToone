import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './membercenter.scss'
import {Link} from 'react-router'
import {isAuth} from '../../../components/Header/modules/auth'
import { connect } from 'react-redux'

@connect(
  state => ({
    auth:state.auth}),
  {isAuth}
)
export default class memberCenter extends Component {

    static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth(this.context.router) 
  }

    render(){
      return(
          <div className="memberCentercontent">
            <Helmet title='个人中心' />
            <div className="memberCenterContentLeft">
            <h3><i className="fa fa-person"></i>个人信息</h3>
            <ul>
              <li><Link to="/membercenter"><i className="fa fa-id-card"></i>&nbsp;基本资料</Link></li>
              <li><Link to="/membercenter/speciality"><i className="fa fa-thumbs-up"></i>&nbsp;专业能力</Link></li>
              <li><Link><i className="fa fa-users"></i>&nbsp;我的团体</Link></li>
            </ul>
            <h3>我的消息</h3>
            <ul>
              <li><Link><i className="fa fa-envelope-open"></i>&nbsp;未  读</Link></li>
              <li><Link><i className="fa fa-envelope-open-o"></i>&nbsp;已  读</Link></li>
            </ul>
            </div>
            <div className="memberCenterContentRight">
              {this.props.children}
            </div>
          </div>
        )}
  }

