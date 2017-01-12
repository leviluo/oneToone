import React from 'react'
import Header from '../../components/Header'
import Tip from '../../components/Tips'
import Modal from '../../components/Modal'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div className='container text-center'>
    <Header />
    <Tip />
    <Modal />
    <div className='mainContainer'>
      {children}
    </div>
    <div className="footer">
    <p>版权所有-上海一一网络技术有限公司</p>
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
