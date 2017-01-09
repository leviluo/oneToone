import React, { Component, PropTypes } from 'react'
import { fetchLocation,modifyLocation } from './modules/location'
import { connect } from 'react-redux';
import './location.scss'
const citys = ["北京","上海","广州","深圳","天津","苏州","重庆","南京","杭州","大连","成都","武汉","济南","厦门","长沙","南昌","其它"]

@connect(
  state => ({
    mylocation: state.mylocation.text
    }),
  {fetchLocation,modifyLocation}
)


export default class Location extends Component{

  componentWillMount =()=>{
    if(!this.props.mylocation.content)this.props.fetchLocation()
  }

  componentWillReceiveProps =()=>{
    
  }

  static propTypes = {
    // mylocation:React.PropTypes.object.isRequired
  }

  changeCity =(e) =>{
    var ele = document.getElementById('locationCities')
    ele.setAttribute('class',"showmove")
    ele.style.display="block"
  }

  chooseCity=(e,item)=>{
    this.props.modifyLocation(item)
    var ele = document.getElementById('locationCities')
    ele.setAttribute('class',"")
    ele.style.display="none"
  }

  cancel=()=>{
    var ele = document.getElementById('locationCities')
    ele.setAttribute('class',"")
    ele.style.display="none"
  }

  render(){
    console.log(this.props.mylocation)
    const {mylocation} = this.props
    let address = mylocation.content ? mylocation.content.address :'';
    return(
      <span className="location">
       <span><i className="fa fa-map-marker"></i>&nbsp;[{address}]&nbsp;</span>
        <a onClick={this.changeCity}>切换城市
        </a>
          <div id="locationCities">
            <ul>
              {citys.map((item,index)=><li key={index}>
                <a onClick={(e)=>this.chooseCity(e,item)}>{item}</a>
              </li>)}
              <li><a onClick={this.cancel}>取消</a></li>
            </ul>
          </div>
       </span>
      )
  }
}

