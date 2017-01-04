import React, { Component, PropTypes } from 'react'
import { fetchLocation } from './modules/location'
import { connect } from 'react-redux';
// import {asyncConnect} from 'redux-async-connect'

// @asyncConnect([{
//   promise: ({store: {dispatch, getState}}) => {
//     const promises = [];
//     // console.log("0000")
//     if (!getState().mylocation.content) {
//       promises.push(dispatch(fetchLocation()));
//     }

//     return Promise.all(promises);
//   }
// }])

@connect(
  state => ({
    mylocation: state.mylocation.text
    }),
  {fetchLocation}
)

export default class Location extends Component{

  componentWillMount =()=>{
    if(!this.props.mylocation.content)this.props.fetchLocation()
  }

  componentWillReceiveProps =()=>{
    // console.log("componentWillReceiveProps")
  }

  static propTypes = {
    mylocation:React.PropTypes.object.isRequired
  }

  render(){
    const {mylocation} = this.props
    let address = mylocation.content ? mylocation.content.address :'';
    return(
      <span><i className="fa fa-map-marker"></i>&nbsp;[{address}]&nbsp;<a href="javascript:void(0)">切换城市</a>
       </span>
      )
  }
}

