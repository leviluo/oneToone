import React from 'react'
import Helmet from 'react-helmet'
import './HomeView.scss'
import Banner from '../../../components/Banner'
import {Link} from 'react-router'
import {connect} from 'react-redux'
const imgItems = ["banner1.jpg","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg"]

@connect(state=>({
    categories:state.categories
}),{})
export default class HomeView extends React.Component{

    comonentWillMount=()=>{
        // if (!this.props.categories.text) {return}
    }

    render(){   
        let _object = {};
        let cateItems = [];
        this.props.categories.text.map(function(item,index){
            if (!_object[item.parentName]) {_object[item.parentName]=[]}
             _object[item.parentName].push(<li key={index}><Link>{item.childName}</Link></li>)
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

