import React, {Component} from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import Modal from '../../../../components/Modal'
import Select from '../../../../components/Select'
import Textarea from '../../../../components/Textarea'
import {modal} from '../../../../components/Modal/modules/modal'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {addSpeciatity,fetchSpeciality} from './modules'
import {fetchCatelogue} from '../../../../reducers/category'
import './speciality.scss'
import {asyncConnect} from 'redux-async-connect'



@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    // if (!getState().myspecialities.isloaded) {
      promises.push(dispatch(fetchSpeciality()));
    // }
    if (!getState().catelogues.isloaded) {
      promises.push(dispatch(fetchCatelogue()));
    }
    return Promise.all(promises);
  }
}])

@connect(
  state => ({
    myspecialities:state.myspecialities,
    catelogues:state.catelogues
    }),
  {modal,tipShow,addSpeciatity}
)
export default class SpecialityComponent extends Component {

  state ={
    content:<div></div>,
  }

  componentWillMount =()=>{
    // if (!this.props.myspecialities.isloaded){
    //   this.props.fetchSpeciality()
    // } 
  }

  shouldComponentUpdate =()=>{
    if (!this.props.myspecialities.isloaded){
      return false
    }
    return true
  }


  addSpeciatity=()=>{

    if (!this.state.speciality) {
      this.props.tipShow({type:"error",msg:"选择一个专业"})
      return
    }
    if (!this.state.brief || this.state.brief.length < 10 || this.state.brief.length >= 295) {
      this.props.tipShow({type:"error",msg:"简介在10到300个字符之间"})
      return
    }
    if (!this.state.experience) {
      this.props.tipShow({type:"error",msg:"未填写工作经验"})
      return
    }

    this.props.addSpeciatity({speciality:this.state.speciality,brief:this.state.brief,experience:this.state.experience})
  }

  specialityChange =(e)=>{
    this.setState({
      speciality:e.target.value
    })
  }

  briefChange = (e)=>{
    this.setState({
      brief:e.target.value
    })
  }

  experienceChange = (e)=>{
    this.setState({
      experience:e.target.value
    })
  }
  componentWillReceiveProps =(nextProps)=>{
    
  }
  shouldComponentUpdate =(nextProps)=>{
    return true
  }
  showAddSpciality=()=>{

    let items = [];
 
    this.props.catelogues.text.map((item,index)=>{
      items.push({key:item.childCatelogue,value:item.childCatelogue})
    })

    this.setState({
      content:<div>
      <div>
      <Select header="选择专业" optionsItems={items} handleChange={this.specialityChange} />
      </div><div>
      <Textarea header="简介" defaultValue="不超过300个字符" handleTextarea={this.briefChange} />
      </div><div>
      <Textarea header="经验" handleTextarea={this.experienceChange} />
      </div>
      </div>
    })

    this.props.modal(true);
  }


  render () {
       console.log(this.props)
    return (
        <div>
          {this.props.myspecialities.text.map((item,index)=>
            <div className="specialities" key={index}>
              <table>
              <tbody>
              <tr><td><h3>{item.speciality}</h3></td><td><button className="btn-primary">修改</button></td></tr>
              <tr><td>介绍</td><td>{item.brief}</td></tr>
              <tr><td>经验</td><td>{item.experience}</td></tr>
              </tbody>
              </table>
            </div>
            )}
          <div className="addSpeciaity">
          <button onClick={this.showAddSpciality} className="btn-primary">+</button>
          </div>
          <Modal header="添加专业" content={this.state.content} submit={this.addSpeciatity} />
          </div>
    )
  }
}

SpecialityComponent.propTypes = {
  nickname: React.PropTypes.string
}
