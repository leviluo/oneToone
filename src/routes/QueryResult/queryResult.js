import React, { Component, PropTypes } from 'react'
import './queryResult.scss'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Select from '../../components/Select'
import {query} from './modules'
import PageNavBar,{pageNavInit} from '../../components/PageNavBar'

const optionsItems = [{key:1,value:"用户"},{key:2,value:"社团"},{key:3,value:"文章"}]

@connect(
  state=>({
    auth:state.auth,
    pagenavbar:state.pagenavbar
  }),
{pageNavInit})
export default class queryResult extends Component{

  state = {
    results:[],
    averagenum:10
  }

  query =()=>{
    var queryStr = this.refs.queryStr.value
    if (queryStr.length < 0 || queryStr.length > 50 || !queryStr) {
      this.props.tipShow({type:'error',msg:"字符数1~50之间"})
      return
    }
    this.setState({
      type:this.refs.queryType.getValue()
    })
    this.props.pageNavInit(this.getData)
  }

  getData = (currentPage)=>{
    return query({type:this.refs.queryType.getValue(),queryStr:this.refs.queryStr.value,limit:`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`}).then(({data})=>{
      if (data.status == 200) { 
          this.setState({ 
              results:data.data 
          }) 
          console.log(data.data)
          return Math.ceil(data.count/this.state.averagenum)
        }else{ 
          this.props.tipShow({type:'error',msg:data.msg})
        } 
    })
  }

  render(){
          console.log(this.state.results)
    return(
      <article className="queryResult">
          <Helmet title="搜索结果"/>
          <nav>
          	   <Select optionsItems={optionsItems} ref="queryType" defaultValue="1" /><input ref="queryStr" type="text"/><button className="btn-default" onClick={this.query}><i className="fa fa-search"></i></button>
          </nav>
          <section>
			       <h3>搜索结果</h3>
             {(this.state.results.length == 0 && this.state.type) && <div style={{textAlign:"center"}}>没有搜到任何结果~</div>}
             {this.state.results.map((item,index)=>{
                if (this.state.type == 1) {
                    return <div className="member" key={index}>
                      <img src={`/originImg?from=member&name=${item.phone}`} alt=""/>
                      <ul>
                          <li><Link to={`/memberBrief/${item.id}`}>{item.nickname}</Link></li>
                          <li>{item.sex == 1 ? "女" : "男"} - {item.location}</li>
                          <li>{item.biref}</li>
                      </ul>
                    </div>
                }else if (this.state.type == 2) {
                    return <div key={index}>

                    </div>
                }else{
                    return <div key={index}>

                    </div>
                }
             })}
             <PageNavBar />
             <div style={{clear:"both"}}></div>
          </section>
      </article>
      )
  }
}

