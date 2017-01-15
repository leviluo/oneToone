import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
// import {modalShow,modalHide} from '../../../../components/Modal/modules/modal'
// import { tipShow } from '../../../../components/Tips/modules/tips'
// import {commitHeadImg,getMemberInfo} from './modules/basicInfo'
import {chatShow} from '../../../../components/Chat/modules/chat'
import {messageList} from './modules/myMessage'

@connect(
  state => ({
    auth:state.auth,
    }),
  {chatShow}
)

export default class myMessage extends Component {

  state ={
    items:[]
  }

  componentWillMount =()=>{
    messageList().then(({data})=>{
      console.log(data.data)
      this.setState({
        items:data.data
      })
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
    console.log(this.state.items)
    return (
    <div>
      <div className="messageContent">
        {this.state.items.map((item,index)=>{
          var headImg = `/public/Headload?member=${item.phone}`
          var imgUrl = item.imgUrl ? `/img?name=${item.imgUrl}` : ''
          var date = new Date(item.time)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          if (item.isSend) {
            var head = <span>你发送给 <b>{item.nickname}</b> 的消息:</span>
            var isRead = item.active == '0'?'对方未读':'对方已读'
          }else{
            var head = <span><b>{item.nickname}</b> 发送给你的消息:</span> 
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
      </div>
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}

