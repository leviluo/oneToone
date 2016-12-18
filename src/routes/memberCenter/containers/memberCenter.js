import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './membercenter.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { findDOMNode } from 'react-dom'
import Modal from '../../../components/Modal'
import Select from '../../../components/Select'
import {modal} from '../../../components/Modal/modules/modal'

@connect(
  state => ({
    auth:state.auth
    }),
  {modal}
)
export default class memberCenter extends Component {

  state ={
    view:"basic",
    content:<div></div>,
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

  addSpeciatity=()=>{

  }

  specialityChange =()=>{

  }

  showAddSpciality=()=>{
    const items = [{key:1,value:"健身教练"},{key:2,value:"数学家教"}]
    this.setState({
      content:<div><Select header="选择专业" optionsItems={items} handleChange={this.specialityChange} /></div>
    })
    this.props.modal(true);
  }


  render () {
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
          <tr><td colSpan="2"><button>修改密码</button></td></tr>
          </tbody>
          </table>
          </div>}
          {this.state.view == "speciality" && <div className="speciality">

          <div className="specialities">
            <table>
            <tbody>
            <tr><td><h3>健身教练</h3></td><td><button className="btn-primary">修改</button></td></tr>
            <tr><td>介绍</td><td>我的名字叫李奇</td></tr>
            <tr><td>经验</td><td>经验撒地方撒分身乏术</td></tr>
            <tr><td>我的小主</td><td>家里看监控计划</td></tr>
            </tbody>
            </table>
          </div>

          <div className="specialities">
            <table>
            <tbody>
            <tr><td><h3>心理咨询</h3></td><td><button className="btn-primary">修改</button></td></tr>
            <tr><td>介绍</td><td>我的名字叫李奇</td></tr>
            <tr><td>经验</td><td>经验撒地方撒分身乏术</td></tr>
            <tr><td>我的小主</td><td>人特委托人委托</td></tr>
            </tbody>
            </table>
          </div>
          <div className="addSpeciaity">
          <button onClick={this.showAddSpciality} className="btn-primary">+</button>
          </div>
          <Modal header="添加专业" content={this.state.content} submit={this.addSpeciatity} />
          </div>}
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