import React from 'react'
import Helmet from 'react-helmet'
import Banner from '../../../components/Banner'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../modules'
import {asyncConnect} from 'redux-async-connect'

const imgItems = ["banner1.jpg","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg"]
import './HomeView.scss'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!getState().catelogues.isloaded) {
      promises.push(dispatch(fetchCatelogue()));
    }

    return Promise.all(promises);
  }
}])

@connect(state=>({
    catelogues:state.catelogues
}),{})
export default class HomeView extends React.Component{

    componentWillMount=()=>{
        let _object = {};
        this.cateItems = [];
        this.props.catelogues.text.map(function(item,index){
            if (!_object[item.parentCatelogue]) {_object[item.parentCatelogue]=[]}
                console.log()
             _object[item.parentCatelogue].push(<li key={index}><Link to={`/Catelogue/${item.parentCatelogue}/${item.childCatelogue}`}>{item.childCatelogue}</Link></li>)
        })
        for(var key in _object){
            this.cateItems.push(<li key={key}><Link to={`/Catelogue/${key}`}>{key}</Link><span>&gt;</span><div className="categoryDetails"><ul>{_object[key]}</ul></div></li>)
        }
    }

    render(){   
        
        return <div>
        <Helmet title='首页' />
        <div className="homeContent">
        	<div className="categoryContent">
            	<ul>{this.cateItems.map((item,index)=>item)} 
            	</ul>
            </div>
        	<Banner items={imgItems}/>
        </div>
      </div>
    }
}

