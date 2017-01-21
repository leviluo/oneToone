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
      if(this.props.location)
      return(
          <div className="memberCentercontent">
            <Helmet title='个人中心' />
            <div className="memberCenterContentLeft">
            <h3><i className="fa fa-person"></i>个人中心</h3>
            <ul>
              <li><Link to="/memberCenter" className={this.props.location.pathname == '/memberCenter' ? 'active' : ''}><i className="fa fa-id-card"></i>&nbsp;我的名片</Link></li>
              <li><Link to="/memberCenter/myTeam" className={this.props.location.pathname == '/memberCenter/myTeam' ? 'active' : ''}><i className="fa fa-users"></i>&nbsp;社团</Link></li>
              <li><Link to="/memberCenter/myMessage" className={this.props.location.pathname == '/memberCenter/myMessage' ? 'active' : ''}><i className="fa fa-comments"></i>&nbsp;消息</Link></li>
            </ul>
            </div>
            <div className="memberCenterContentRight">
              {this.props.children}
            </div>
            <ImageBrowser />
          </div>
        )}
  }

