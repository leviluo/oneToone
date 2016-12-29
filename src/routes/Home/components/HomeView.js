import React from 'react'
import Helmet from 'react-helmet'
import Banner from '../../../components/Banner'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../modules'
// import {asyncConnect} from 'redux-async-connect'

const imgItems = ["banner1.jpg","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg"]
import './HomeView.scss'

// @asyncConnect([{
//   promise: ({store: {dispatch, getState}}) => {
//     const promises = [];

//     if (!getState().catelogues.text.length < 1) {
//       // promises.push(dispatch(fetchCatelogue()));
//     }

//     return Promise.all(promises);
//   }
// }])
@connect(state=>({
    catelogues:state.catelogues
}),{fetchCatelogue})
export default class HomeView extends React.Component{

    componentWillMount=()=>{
        // console.log(this.props.catelogues)
        if (this.props.catelogues.text.length < 1) this.props.fetchCatelogue()
    }

    render(){   
        let _object = {};
        let cateItems = [];
        this.props.catelogues.text.map(function(item,index){
            if (!_object[item.parentCatelogue]) {_object[item.parentCatelogue]=[]}
             _object[item.parentCatelogue].push(<li key={index}><Link>{item.childCatelogue}</Link></li>)
        })
        for(var key in _object){
            cateItems.push(<li key={key}><Link>{key}</Link><span>&gt;</span><div className="categoryDetails"><ul>{_object[key]}</ul></div></li>)
        }
        return <div>
        <Helmet title='首页' />
        <div className="homeContent">
        	<div className="categoryContent">
            	<ul>{cateItems.map((item,index)=>item)} 
            	</ul>
            </div>
        	<Banner items={imgItems}/>
        </div>
      </div>
    }
}

