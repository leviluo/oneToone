import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './membercenter.scss'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import SpecialityComponent from '../components/speciality.js'
import {isAuth} from '../../../components/Header/modules/auth'

@connect(
  state => ({
    auth:state.auth,
    }),
  {isAuth}
)
export default class memberCenter extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state ={
    view:"basic",
  }

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth(this.context.router)
  }

  shouldComponentUpdate =(nextProps)=>{
    // if(nextProps.myspecialities === this.props.myspecialities)return false
    // if(nextProps === this.props) return false
    // console.log("1111")
      // console.log("0000")
    return true
  }

  componentDidMount = ()=>{
    findDOMNode(this).getElementsByTagName("a")[0].style.color = "#1C86EE"
    this.setState({
      target:findDOMNode(this).getElementsByTagName("a")[0]
    })
  }

  changeView =(e,view)=>{
    this.state.target.style.color = "#666"
    e.target.style.color = "#1C86EE"
    this.setState({
      view:view,
      target:e.target
    })
  }

  render () {
    // console.log(this.props.auth)
    let nickname = this.props.auth.nickname
    return (
      <div className="memberCentercontent">
        <Helmet title='个人中心' />
        <div className="memberCenterContentLeft">
        <h3><i className="fa fa-person"></i>个人信息</h3>
        <ul>
          <li><a onClick={(e)=>this.changeView(e,"basic")}><i className="fa fa-id-card"></i>&nbsp;基本资料</a></li>
          <li><a onClick={(e)=>this.changeView(e,"speciality")}><i className="fa fa-thumbs-up"></i>&nbsp;专业能力</a></li>
          <li><a onClick={(e)=>this.changeView(e,"team")}><i className="fa fa-users"></i>&nbsp;我的团体</a></li>
        </ul>
        <h3>我的消息</h3>
        <ul>
          <li><a onClick={(e)=>this.changeView(e,"noRead")}><i className="fa fa-envelope-open"></i>&nbsp;未  读</a></li>
          <li><a onClick={(e)=>this.changeView(e,"Read")}><i className="fa fa-envelope-open-o"></i>&nbsp;已  读</a></li>
        </ul>
        </div>
        <div className="memberCenterContentRight">
          {this.state.view == "basic" && <div>
          <table>
          <tbody>
          <tr><td>头像</td><td><img src="/favicon.ico" /><br /><a>修改</a></td></tr>
          <tr><td>昵称</td><td>{nickname}</td></tr>
          <tr><td colSpan="2"><button className="btn-primary">修改密码</button></td></tr>
          </tbody>
          </table>
          </div>}
          {this.state.view == "speciality" && 
          <SpecialityComponent />
          }
          {this.state.view == "team" && <div>tab3tab3tab3tab3</div>}
          {this.state.view == "noRead" && <div>tab4tab4tab4tab4tab4</div>}
          {this.state.view == "Read" && <div>tab5tab5tab5tab5tab5tab5</div>}
        </div>
      </div>
    )
  }
}

memberCenter.propTypes = {
  // zen: React.PropTypes.object.isRequired
}