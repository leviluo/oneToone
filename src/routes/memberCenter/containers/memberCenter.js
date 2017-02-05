import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './membercenter.scss'
import {Link} from 'react-router'
import {isAuth} from '../../../reducers/auth'
import { connect } from 'react-redux'
import ImageBrowser from '../../../components/ImageBrowser'


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
      // console.log(this.props)
  }

    render(){
      // console.log(this.props)
      return(
          <div className="memberCentercontent">
            <Helmet title='个人中心' />
            <div className="memberCenterContentLeft">
            <h3>基本信息</h3>
            <ul>
              <li><Link to="/memberCenter" className={this.props.location.pathname == '/memberCenter' ? 'active' : ''}>我的名片</Link></li>
              <li><Link to="/memberCenter/myMessage" className={this.props.location.pathname == '/memberCenter/myMessage' ? 'active' : ''}>消息</Link></li>
              <li><Link to="/memberCenter/myMessage" className={this.props.location.pathname == '/memberCenter/notice' ? 'active' : ''}>通知</Link></li>
            </ul>
            <h3>社团</h3>
            <ul>
              <li><Link to="/memberCenter/myCreateTeam" className={this.props.location.pathname == '/memberCenter/myCreateTeam' ? 'active' : ''}>我创建的</Link></li>
              <li><Link to="/memberCenter/myAttendTeam" className={this.props.location.pathname == '/memberCenter/myAttendTeam' ? 'active' : ''}>我加入的</Link></li>
              <li><Link to="/memberCenter/myTeam" className={this.props.location.pathname == '/memberCenter/myPost' ? 'active' : ''}>我发布的</Link></li>
            </ul>
            </div>
            <div className="memberCenterContentRight">
              {this.props.children}
            </div>
            <ImageBrowser />
          </div>
        )}
  }

