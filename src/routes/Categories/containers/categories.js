import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
import {fetchItems} from '../modules'
import {asyncConnect} from 'redux-async-connect'
import Select from '../../../components/Select'
import PageNavBar,{pageNavInit} from '../../../components/PageNavBar'
import {tipShow} from '../../../components/Tips/modules/tips'
import './categories.scss'
import Chat,{chatShow} from '../../../components/Chat'

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
    catelogues:state.catelogues,
    mylocation:state.mylocation,
    auth:state.auth
}),{chatShow,tipShow,pageNavInit})
export default class Categories extends React.Component{

    componentWillMount=(nextProps)=>{
        // console.log("componentWillMount")
    }

    componentWillUpdate =()=>{
        // console.log("componentWillUpdate")
    }

    componentDidMount=()=>{
        // console.log("componentDidMount")
        if (this.props.catelogues.isloaded) {  //从首页跳转
            this.setStyle(this.props.location.query.childCatelogue?this.props.location.query.childCatelogue:this.props.location.query.parentCatelogue);
        }
        if (this.props.mylocation.isloaded) {  //加载数据
            this.initItems(this.props)
        }
    }


    initItems =(props)=>{
        let speciality = props.location.query.childCatelogue ? props.location.query.childCatelogue :props.location.query.parentCatelogue
        let address = props.mylocation.text.content ? props.mylocation.text.content.address :'';
        if (props.location.query.childCatelogue) {   //从子条目进入
            this.setState({
                speciality:speciality,
                address:address,
                childCatelogue:props.location.query.childCatelogue
            })
            this.props.pageNavInit(this.updateSpecialityData)
        }else{                                      //从父条目进入
            this.setState({
                speciality:speciality,
                address:address,
                childCatelogue:props.location.query.childCatelogue
            })    
            console.log(this.updateParentSpecialityData)
            this.props.pageNavInit(this.updateParentSpecialityData)                             
        }
    }

    updateSpecialityData = (currentPage)=>{
        return fetchItems({address:this.state.address,speciality:this.state.speciality,limit:`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`}).then(({data})=>{
            if (data.status == 200) {
                this.setState({
                  allItems:data.data
                })
               return Math.ceil(data.count/this.state.averagenum)
              }else {
                this.props.tipShow({type:"error",msg:data.msg})
                return
              }
        })
    }

    updateParentSpecialityData = (currentPage)=>{
        return fetchItems({address:this.state.address,parentSpeciality:this.state.speciality,limit:`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`}).then(({data})=>{
            if (data.status == 200) {
                this.setState({
                  allItems:data.data
                })
                return Math.ceil(data.count/this.state.averagenum)
              }else {
                this.props.tipShow({type:"error",msg:data.msg})
                return
              }
        })
    }

    componentWillReceiveProps =(nextProps)=>{
            if (this.props.catelogues.isloaded) {
                this.setStyle(nextProps.location.query.childCatelogue?nextProps.location.query.childCatelogue:nextProps.location.query.parentCatelogue);   //刷新页面
            }
            if (nextProps.mylocation.isloaded) {  //加载数据
                this.initItems(nextProps)
            }
    }

    state = {
        averagenum:5,
        childCatelogue:'',
        chatTo:'',
        sendTo:'',
        allItems:[]
    }    

    setStyle =(name)=>{
        var ele = document.getElementById('categoryItems').getElementsByTagName('a')
        for (var i = 0; i < ele.length; i++) {
            ele[i].style.color = "#000"
        }
        document.getElementsByName(name)[0].style.color = "#3a5fcd"
    }

    allCategory = (e)=>{
        this.setStyle(this.props.location.query.parentCatelogue)
        this.setState({
            childCatelogue:'',
            speciality:this.props.location.query.parentCatelogue
        })
        this.props.pageNavInit(this.updateParentSpecialityData)  
    }

    getoneCategory=(speciality)=>{
        this.setStyle(speciality)
        this.setState({
            childCatelogue:speciality,
            speciality:speciality
        })
        this.props.pageNavInit(this.updateSpecialityData)
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
        const{catelogues,location} = this.props
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
            {this.state.allItems.map((item,index)=> {
                let src = `/originImg?from=member&name=${item.phone}`
                let brief = item.brief.length > 50 ? item.brief.slice(0,50) + '...' : item.brief
                let link = `/memberBrief/${item.memberId}`
                return <div key={index} className="itemContent">
                     <span><a className="btn-default" onClick={()=>this.showChat(item.nickname,item.phone)}>私信</a>&nbsp;&nbsp;<Link className="btn-default" to={link}>查看名片</Link></span>
                    <img src={src} alt=""/>
                    <div><ul><li><Link to={link}>{item.nickname}</Link>(<span className="title">性别:</span>{item.sex==0 && <span>男</span>}{item.sex==1 && <span>女</span>})</li><li><span className="title">简介:</span>{brief}</li><li><span className="title">能力:</span>{item.name}</li><li><span className="title">现居住地:</span>{item.address}</li></ul></div>
                </div>
            }
            )}
            <PageNavBar />
        </div>
        <Chat />
      </div>
    }
}

