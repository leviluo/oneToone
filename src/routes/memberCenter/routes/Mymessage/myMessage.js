import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {messageList} from './modules/myMessage'
import Chat,{chatShow} from '../../../../components/Chat'
import PageNavBar from '../../../../components/PageNavBar'
import {pageNavInit} from '../../../../components/PageNavBar/modules/pagenavbar'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    
  }
}])

@connect(
  state => ({
    auth:state.auth,
    pagenavbar:state.pagenavbar
    }),
  {chatShow,pageNavInit,tipShow}
)

export default class myMessage extends Component {

  state ={
    items:[],
    averagenum:5
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    messageList().then(({data})=>{
      if (data.status == 200) {
        var pageNums = Math.ceil(data.data.length/this.state.averagenum)
        this.props.pageNavInit(pageNums)
        this.setState({
          items:data.data
        })
      }else if (data.status==600) {
        this.props.dispatch({type:"AUTHOUT"})
        this.context.router.push('/login')
      }{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  showChat =(nickname,phone)=>{
    // this.setState({
    //     chatTo:name,
    //     sendTo:phone
    // })
    this.props.chatShow({chatTo:nickname,chatFrom:this.props.auth.nickname,sendTo:phone})
  }

  render () {

    return (
    <div>
      <div className="messageContent">
        {this.state.items.slice(this.state.averagenum*(this.props.pagenavbar.currentPage-1),this.state.averagenum*this.props.pagenavbar.currentPage).map((item,index)=>{
          var headImg = `/public/Headload?member=${item.phone}`
          var imgUrl = item.imgUrl ? `/img?from=chat&name=${item.imgUrl}` : ''
          var date = new Date(item.time)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          var link = `/memberBrief/${item.phone}`
          if (item.isSend) {
            var head = <span>你发送给 <Link to={link}>{item.nickname}</Link> 的消息:</span>
            var isRead = item.active == '0'?'对方未读':'对方已读'
          }else{
            var head = <span><Link to={link}>{item.nickname}</Link> 发送给你的消息:</span> 
            var isRead = item.active == '0'?'未读':'已读'
          }
          return <div key = {index}>
              <img src={headImg} /><span><a onClick={()=>this.showChat(item.nickname,item.phone)}>查看</a></span>
              <ul>
                <li><span style={{color:item.active == '0' ? 'green' : '#666'}}>●</span><span>({isRead})</span><span>{time}</span>{head} </li>
                <li>{item.text}{item.imgUrl && <img src={imgUrl} />}</li>
              </ul>
          </div>
        })}
      <PageNavBar />
      </div>
      <Chat />
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}

