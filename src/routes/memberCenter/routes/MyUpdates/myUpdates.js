import React, {Component} from 'react'
import './myUpdates.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getMyUpdates} from './modules'

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
  {tipShow}
)

export default class myUpdates extends Component {

    state = {
      myUpdates:[]
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
      getMyUpdates().then(({data})=>{
        if (data.status == 200) {
          this.setState({
            myUpdates:data.data
          })
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
    }

  render () {
    return (
    <div className="myUpdates">
        {this.state.myUpdates.map((item,index)=>{
          return <div key={index} className="lists">
              <img width="50" src={`/originImg?from=member&name=${item.phone}`} alt=""/>
              {item.title && <div>在<Link to={`/organizationHome/${item.organizationsId}`}>{item.name}</Link>发布了<Link to={`/article/${item.articleId}`}>{item.title}</Link></div>}
              {item.works && <div>上传了</div>}
              <span className="pull-right"></span>
          </div>
        })}
    </div>
    )
  }
}

myUpdates.propTypes = {
  auth: React.PropTypes.object
}
