import React, {Component} from 'react'
import './follows.scss'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../components/Tips/modules/tips'
import {getFollows,getFans} from './modules'
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
      averagenum:20,
      currentPage:1,
      items:[]
    }

    componentWillMount=()=>{
      this.getFollowData(this.state.currentPage)
      // this.getFans(this.state.currentPage)
    }

    getFollowData =(currentPage)=>{
      // console.log(currentPage)
      getFollows(this.props.params.memberId,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
          this.setState({
            items:data.data,
          })
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }

    getFanData =(currentPage)=>{
      getFans(this.props.params.memberId,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        
      })
    }

    checkFollows =(e)=>{
      this.refs.back.style.left = "2px"
      this.setState({
        currentPage:1,
      })
      this.getFollowData(1)
    }

    checkFans =(e)=>{
       this.refs.back.style.left = "42px"
       this.setState({
        currentPage:1,
      })
      this.getFanData(1)
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
            <strong onClick={this.checkFollows}>关注</strong>
            <button ref="back" className="goForward"></button>
            <strong onClick={this.checkFans}>粉丝</strong>
          </div>
        </div>
        {this.state.items.map((item,index)=>{
          return <div key={index}>

          </div>
        })}
    </div>
    )
  }
}

follows.propTypes = {
  auth: React.PropTypes.object
}
