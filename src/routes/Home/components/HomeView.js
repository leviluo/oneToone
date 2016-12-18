import React from 'react'
import Helmet from 'react-helmet'
import './HomeView.scss'
import Banner from '../../../components/Banner'
import {Link} from 'react-router'

const imgItems = ["banner1.jpg","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg"]

export const HomeView = () => (
  <div>
    <Helmet title='首页' />
    <div className="homeContent">
    	<div className="categoryContent">
        	<ul>
                <li><Link>运动</Link><span>&gt;</span>
                <div className="categoryDetails">
                    <ul>
                        <li><Link>健身教练</Link></li>
                        <li><Link>游泳教练</Link></li>
                        <li><Link>篮球教练</Link></li>
                        <li><Link>羽毛球教练</Link></li>
                        <li><Link>台球教练</Link></li>
                        <li><Link>保龄球教练</Link></li>
                        <li><Link>乒乓球教练</Link></li>
                    </ul>
                </div></li>
        		<li><Link>健康</Link><span>&gt;</span>
                <div className="categoryDetails">
                    <ul>
                        <li><Link>营养师</Link></li>
                        <li><Link>私人健康管理</Link></li>
                    </ul>
                </div></li>
        		<li><Link>理财/经济</Link><span>&gt;</span><div className="categoryDetails">
                    <ul>
                        <li><Link>理财规划</Link></li>
                        <li><Link>会计</Link></li>
                    </ul>
                </div></li>
        		<li><Link>法律</Link><span>&gt;</span><div className="categoryDetails">
                    <ul>
                        <li><Link>婚姻家庭</Link></li>
                        <li><Link>刑事诉讼</Link></li>
                        <li><Link>劳动纠纷</Link></li>
                        <li><Link>交通事故</Link></li>
                        <li><Link>合同纠纷</Link></li>
                        <li><Link>房产纠纷</Link></li>
                        <li><Link>公司法律</Link></li>
                        <li><Link>医疗事故</Link></li>
                        <li><Link>工程纠纷</Link></li>
                        <li><Link>征地拆迁</Link></li>
                        <li><Link>知识产权</Link></li>
                        <li><Link>保险理赔</Link></li>
                    </ul>
                </div></li>
        		<li><Link>学习</Link><span>&gt;</span><div className="categoryDetails">
                    <ul>
                        <li><Link>英语家教</Link></li>
                        <li><Link>日语家教</Link></li>
                        <li><Link>法语家教</Link></li>
                        <li><Link>西班牙语家教</Link></li>
                        <li><Link>数学家教</Link></li>
                        <li><Link>物理家教</Link></li>
                        <li><Link>化学家教</Link></li>
                    </ul>
                </div></li>
        	</ul>

        </div>
    	<Banner items={imgItems}/>
    </div>
  </div>
)

export default HomeView
