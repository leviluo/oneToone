import React, {Component} from 'react'
import './follows.scss'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../components/Tips/modules/tips'
import {getworksData,addLike,deletePhoto,getMemberInfo} from './modules'
import Confirm,{confirmShow} from '../../components/Confirm'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    // const promises = [];
    // if (!getState().catelogues.isloaded) {
    //   promises.push(dispatch(fetchCatelogue()));
    // }
    // return Promise.all(promises);
  }
}])

@connect(
  state => ({
    auth:state.auth,
    }),
  {tipShow,confirmShow}
)

export default class follows extends Component {

    state = {
      worksData:[],
      averagenum:24,
      imgs:[],
      currentPage:1,
      memberInfo:[]
    }


  render () {
    return (
    <div className="follows">
          <Helmet title="关注列表" />
        <div className="followsTop">
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
        </div>
        <div className="switchBtn">
          <div>
            <strong>关注</strong>
            <strong>粉丝</strong>
            <button className="btn-default"></button>
          </div>
        </div>
    </div>
    )
  }
}

follows.propTypes = {
  auth: React.PropTypes.object
}
