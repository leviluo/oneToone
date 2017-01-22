import React from 'react'
import Helmet from 'react-helmet'
import Banner from '../../../components/Banner'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
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


    render(){   

        let _object = {};
        this.cateItems = [];
        this.props.catelogues.text.map(function(item,index){
            if (!_object[item.parentCatelogue]) {_object[item.parentCatelogue]=[]}
             _object[item.parentCatelogue].push(<li key={index}><Link to="/categories/" query={{parentCatelogue:item.parentCatelogue,childCatelogue:item.childCatelogue}}>{item.childCatelogue}</Link></li>)
        })
        for(var key in _object){
            this.cateItems.push(<li key={key}><Link to="/categories/" query={{parentCatelogue:key}}>{key}<span className="fa fa-angle-right"></span></Link><div className="categoryDetails"><ul>{_object[key]}</ul></div></li>)
        }

        return <div className="home">
        <Helmet title='首页' />
        <div className="homeTop">
        	<div className="categoryContent">
            	<ul>{this.cateItems.map((item,index)=>item)} 
            	</ul>
            </div>
        	<Banner items={imgItems}/>
        </div>
        <div className="homeContent">
                <div className="shareHot">
                    <div>热门分享</div>
                    <ul>
                        <li><img src="/public/Headload?member=15601912380" alt="" /></li>
                        <li><img src="/public/Headload?member=15601912385" alt="" /></li>
                        <li><img src="/public/Headload?member=15601912380" alt="" /></li>
                        <li><img src="/public/Headload?member=15601912385" alt="" /></li>
                        <li><img src="/public/Headload?member=15601912380" alt="" /></li>
                        <li><img src="/public/Headload?member=15601912385" alt="" /></li>
                    </ul>
                </div>
                <div className="organizationHot">
                    <div>热门社团</div>
                    <ul>
                        <li>555</li>
                        <li>55</li>
                        <li>55</li>
                        <li>55</li>
                        <li>66</li>
                        <li>66</li>
                    </ul>
                </div>
        </div>
      </div>
    }
}

