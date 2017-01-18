import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
import {fetchItems} from '../modules'
import {asyncConnect} from 'redux-async-connect'
import Select from '../../../components/Select'
import PageNavBar from '../../../components/PageNavBar'
import {pageNavInit} from '../../../components/PageNavBar/modules/pagenavbar'
import {chatShow} from '../../../components/Chat/modules/chat'
import {tipShow} from '../../../components/Tips/modules/tips'
import './categories.scss'
import Chat from '../../../components/Chat'

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
    mylocation: state.mylocation,
    pagenavbar:state.pagenavbar,
    auth:state.auth

}),{fetchItems,chatShow,tipShow,pageNavInit})
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
            document.getElementsByName(this.props.location.query.parentCatelogue)[0].style.color = "#3a5fcd"
        }
    }

    initItems =(props)=>{

        let speciality = props.location.query.childCatelogue ? props.location.query.childCatelogue :props.location.query.parentCatelogue
        let address = props.mylocation.text.content ? props.mylocation.text.content.address :'';
        this.setState({
            address:address,
            childCatelogue:props.location.query.childCatelogue
        })
        if (props.location.query.childCatelogue) {   //从子条目进入
        this.props.fetchItems({address:address,speciality:speciality})
        }else{                                       //从父条目进入
        this.props.fetchItems({address:address,parentSpeciality:speciality})  
        }
    }

    componentWillReceiveProps =(nextProps)=>{
        if ((nextProps.mylocation.isloaded && !nextProps.items.isloaded) || nextProps.mylocation != this.props.mylocation) { //首次更新或者更新地址后再次更新视图
            this.initItems(nextProps)
            this.resetStyle(nextProps.location.query.childCatelogue?nextProps.location.query.childCatelogue:nextProps.location.query.parentCatelogue);   //刷新页面
        }

        if (nextProps.items.isloaded && nextProps.items.text.length > 1 && !this.props.pagenavbar.isloaded) {   //初始化翻页条
            var pageNums = Math.ceil(this.props.items.text.length/this.state.averagenum)
            this.props.pageNavInit(pageNums)
        };
    }

    state = {
        averagenum:5,
        childCatelogue:'',
        chatTo:'',
        sendTo:''
    }    

    resetStyle =(name)=>{
        var ele = document.getElementById('categoryItems').getElementsByTagName('a')
        for (var i = 0; i < ele.length; i++) {
            ele[i].style.color = "#000"
        }
        document.getElementsByName(name)[0].style.color = "#3a5fcd"
    }

    allCategory = (e)=>{
        this.resetStyle(this.props.location.query.parentCatelogue)
        this.props.fetchItems({address:this.state.address,parentSpeciality:this.props.location.query.parentCatelogue})
        this.setState({
            childCatelogue:''
        })
    }

    getoneCategory=(speciality)=>{
        this.resetStyle(speciality)
        this.props.fetchItems({address:this.state.address,speciality:speciality})
        this.setState({
            childCatelogue:speciality
        })
    }

    showChat =(name,phone)=>{
        if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
        if (phone == this.props.auth.phone) return
        this.setState({
            chatTo:name,
            sendTo:phone
        })
        this.props.chatShow({chatTo:name,chatFrom:this.props.auth.nickname,sendTo:phone})
    }


    render(){   
        const{catelogues,mylocation,location,items} = this.props
        let address = mylocation.text.content ? mylocation.text.content.address :'';
        return <div className="category">
        <Helmet title={this.props.location.query.parentCatelogue} />
        <div className="categoryTop">
            <nav><Link to="/">首页</Link> &gt; <a onClick={this.allCategory}>{this.props.location.query.parentCatelogue}</a>{this.state.childCatelogue && <span> &gt; {this.state.childCatelogue}</span>}</nav>
            <div>
                <table >
                    <tbody>
                        <tr>
                            <td>类别:</td>
                            <td><ul id="categoryItems"><li><a onClick={this.allCategory} name={this.props.location.query.parentCatelogue}>全部</a></li>{catelogues.text.map((item,index)=>{
                                if (item.parentCatelogue == location.query.parentCatelogue) {
                                    return <li key={index}><a onClick={()=>this.getoneCategory(item.childCatelogue)} name={item.childCatelogue}>{item.childCatelogue}</a></li>
                                }
                            })}</ul></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="categoryContent">
            {items.text.slice(this.state.averagenum*(this.props.pagenavbar.currentPage-1),this.state.averagenum*this.props.pagenavbar.currentPage).map((item,index)=> {
                let src = `/public/Headload?member=${item.phone}`
                let brief = item.brief.length > 50 ? item.brief.slice(0,50) + '...' : item.brief
                return <div key={index} className="itemContent">
                     <span><a onClick={()=>this.showChat(item.nickname,item.phone)}>私信</a>&nbsp;&nbsp;<Link to='/memberBrief' query={{phone:item.phone,nickname:item.nickname,sex:item.sex,address:item.address}} >查看名片</Link></span>
                    <div><img src={src} alt=""/></div>
                    <div><ul><li>{item.nickname}(<span className="title">性别:</span>{item.sex==0 && <span className="fa fa-male"></span>}{item.sex==1 && <span className="fa fa-female"></span>})</li><li><span className="title">简介:</span>{brief}</li><li><span className="title">能力:</span>{item.name}</li><li><span className="title">现居住地:</span>{item.address}</li></ul></div>
                </div>
            }
            )}
            <PageNavBar />
        </div>
        <Chat />
      </div>
    }
}

