import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
import {fetchItems} from '../modules'
import {asyncConnect} from 'redux-async-connect'
import Select from '../../../components/Select'
import './categories.scss'

@asyncConnect([{
  promise: ({store: {dispatch, getState},a}) => {
    const promises = [];

    if (!getState().catelogues.isloaded) {
      promises.push(dispatch(fetchCatelogue()));
    }

    return Promise.all(promises);
  }
}])

@connect(state=>({
    items:state.items,
    catelogues:state.catelogues,
    mylocation: state.mylocation
}),{fetchItems})
export default class Categories extends React.Component{

    componentWillMount=(nextProps)=>{
        // console.log(speciality)
        // console.log(address)
    }

    componentDidMount=()=>{
        if (this.props.catelogues.isloaded) {  //从首页跳转
            this.setStyle();
        }
        if (this.props.mylocation.isloaded) {  //加载数据
            this.initItems(this.props)
        }
    }

    setStyle = (e)=>{
        if(document.getElementsByName(this.props.location.query.childCatelogue)[0]){
            document.getElementsByName(this.props.location.query.childCatelogue)[0].style.color = "#3a5fcd"
        }else{
            document.getElementsByName("allCategory")[0].style.color = "#3a5fcd"
        }
    }

    initItems =(props)=>{
        let speciality = props.location.query.childCatelogue ? props.location.query.childCatelogue :props.location.query.parentCatelogue
        let address = props.mylocation.text.content ? props.mylocation.text.content.address :'';
        this.props.fetchItems({address:address,speciality:speciality})
    }

    componentWillReceiveProps =(nextProps)=>{
        if (nextProps.mylocation.isloaded && !nextProps.items.isloaded) {
            this.initItems(nextProps)
        }
    }

    componentDidUpdate=()=>{
        this.setStyle();   //刷新页面
    }

    render(){   
        // console.log(this.props.items)
        const{catelogues,mylocation,location,items} = this.props
        let address = mylocation.text.content ? mylocation.text.content.address :'';
        return <div className="category">
        <Helmet title='列表' />
        <div className="categoryTop">
            <nav><Link to="/">首页</Link> &gt; <Link to="/categories/" query={{parentCatelogue:this.props.location.query.parentCatelogue}}>{this.props.location.query.parentCatelogue}</Link>{this.props.location.query.childCatelogue && <span> &gt; {this.props.location.query.childCatelogue}</span>}</nav>
            <div>
                <table >
                    <tbody>
                        <tr>
                            <td>地点:</td>
                            <td><ul><li><a href="">全国</a></li><li><a style={{color:'#3a5fcd'}}>{address}</a></li><li><a href="">其它</a></li></ul></td>
                        </tr>
                        <tr>
                            <td>类别:</td>
                            <td><ul><li><a href="" name="allCategory">全部</a></li>{catelogues.text.map((item,index)=>{
                                if (item.parentCatelogue == location.query.parentCatelogue) {
                                    return <li key={index}><a name={item.childCatelogue}>{item.childCatelogue}</a></li>
                                }
                            })}</ul></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="categoryContent">
            {items.text.map((item,index)=> {
                let src = `/public/Headload?member=${item.phone}`
                return <div className="itemContent">
                    <div><img src={src} alt=""/></div>
                    <div></div>
                </div>
            }
            )}
        </div>
      </div>
    }
}

