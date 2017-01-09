import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
import {fetchItems} from '../modules'
import {asyncConnect} from 'redux-async-connect'
import Select from '../../../components/Select'
import PageNavBar from '../../../components/PageNavBar'
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
        this.setState({
            address:address
        })
        this.props.fetchItems({address:address,speciality:speciality})
    }

    componentWillReceiveProps =(nextProps)=>{
        if (nextProps.mylocation.isloaded && !nextProps.items.isloaded) {
            this.initItems(nextProps)
            this.resetStyle(nextProps.location.query.childCatelogue?nextProps.location.query.childCatelogue:nextProps.location.query.parentCatelogue);   //刷新页面
        }
    }

    state = {
        currentPage:1,
        averagenum:10
    }    

    pageup = (e)=>{
        if (this.state.currentPage == 1) {return};
        this.setState({
            currentPage:this.state.currentPage == 1 ? 1 : this.state.currentPage - 1
        })
    }

    pagedown = (e,pageNums)=>{
        if (this.state.currentPage == pageNums) {return};
        this.setState({
            currentPage:this.state.currentPage == pageNums ? pageNums : this.state.currentPage + 1
        })
    }

    firstpage = () =>{
        if (this.state.currentPage == 1) {return};
        this.setState({
            currentPage:1
        })
    }

    lastpage = (e,pageNums) =>{
        if (this.state.currentPage == pageNums) {return};
        this.setState({
            currentPage:pageNums
        })
    }

    pagego = (e,currentPage) =>{
        console.log(currentPage)
        if (this.state.currentPage == currentPage) {return};
            this.setState({
                currentPage:currentPage
            })
    }

    resetStyle =(name)=>{
        var ele = document.getElementById('categoryItems').getElementsByTagName('a')
        for (var i = 0; i < ele.length; i++) {
            ele[i].style.color = "#000"
        }
        document.getElementsByName(name)[0].style.color = "#3a5fcd"
        this.setState({
            currentPage:1,
        })
    }

    allCategory = (e)=>{
        this.resetStyle(this.props.location.query.parentCatelogue)
        this.props.fetchItems({address:this.state.address,parentSpeciality:this.props.location.query.parentCatelogue})
    }

    getoneCategory=(speciality)=>{
        this.resetStyle(speciality)
        this.props.fetchItems({address:this.state.address,speciality:speciality})
    }


    render(){   
        const{catelogues,mylocation,location,items} = this.props
        let address = mylocation.text.content ? mylocation.text.content.address :'';
        return <div className="category">
        <Helmet title={this.props.location.query.parentCatelogue} />
        <div className="categoryTop">
            <nav><Link to="/">首页</Link> &gt; <Link to="/categories/" query={{parentCatelogue:this.props.location.query.parentCatelogue}}>{this.props.location.query.parentCatelogue}</Link>{this.props.location.query.childCatelogue && <span> &gt; {this.props.location.query.childCatelogue}</span>}</nav>
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
            {items.text.slice(this.state.averagenum*(this.state.currentPage-1),this.state.averagenum*this.state.currentPage).map((item,index)=> {
                let src = `/public/Headload?member=${item.phone}`
                let brief = item.brief.length > 50 ? item.brief.slice(0,50) + '...' : item.brief
                return <div key={index} className="itemContent">
                     <span><a>私信</a>&nbsp;&nbsp;<a>查看他/她的名片</a></span>
                    <div><img src={src} alt=""/></div>
                    <div><ul><li>{item.nickname}({item.sex==0 && <span className="fa fa-male"></span>}{item.sex==1 && <span className="fa fa-female"></span>})</li><li>{brief}</li><li>{item.name}</li><li>{item.address}</li></ul></div>
                </div>
            }
            )}
            <PageNavBar pagego={this.pagego} firstpage={this.firstpage} lastpage={this.lastpage} pageup={this.pageup} pagedown={this.pagedown} pageNums={Math.ceil(items.text.length/this.state.averagenum)} currentPage={this.state.currentPage}/>
        </div>
      </div>
    }
}

