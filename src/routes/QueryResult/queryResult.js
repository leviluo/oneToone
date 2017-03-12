import React, { Component, PropTypes } from 'react'
import './queryResult.scss'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Select from '../../components/Select'
import {query} from './modules'

const optionsItems = [{key:1,value:"用户"},{key:2,value:"社团"},{key:3,value:"文章"}]

@connect(
  state=>({auth:state.auth}),
{})
export default class queryResult extends Component{

  query =()=>{
    var queryStr = this.refs.queryStr.value
    if (queryStr.length < 0 || queryStr.length > 50 || !queryStr) {
      this.props.tipShow({type:'error',msg:"字符数1~50之间"})
      return
    }
    query({type:this.refs.queryType.getValue(),queryStr:queryStr}).then(()=>{

    })
  }


  render(){
    return(
      <article className="queryResult">
          <Helmet title="搜索结果"/>
          <nav>
          	   <Select optionsItems={optionsItems} ref="queryType" defaultValue="1" /><input ref="queryStr" type="text"/><button className="btn-default" onClick={this.query}><i className="fa fa-search"></i></button>
          </nav>
          <section className="content">
			<h3>搜索结果</h3>

          </section>
      </article>
      )
  }
}

