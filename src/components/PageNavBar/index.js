import React, { Component, PropTypes } from 'react'
import './pagenavbar.scss'
import {pageNumChange} from './modules/pagenavbar'
import {connect} from 'react-redux'

@connect(state=>({
    pagenavbar:state.pagenavbar,
}),{pageNumChange})

export default class PageNavBar extends Component {

    componentDidMount = () => {
        //页面切换过来的刷新
        if (document.getElementById('pagenum'+this.props.pagenavbar.currentPage)) {   
                this.SetStyle(this.props.pagenavbar.currentPage)
        };
    }

    SetStyle = (currentPage)=>{
        for (var i = 0; i < document.getElementsByName('pagenum').length; i++) {
            document.getElementsByName('pagenum')[i].style.background = '#ccc';
            document.getElementsByName('pagenum')[i].style.color = '#436EEE';
        };
        document.getElementById('pagenum'+currentPage).style.background = '#436EEE';
        document.getElementById('pagenum'+currentPage).style.color = 'white';
    }

    componentDidUpdate =() =>{
        // 更新视图，或者首次加载页面的更新
        if (document.getElementById('pagenum'+this.props.pagenavbar.currentPage)) {   
                this.SetStyle(this.props.pagenavbar.currentPage)
        };
    }

    pageup = (e)=>{
        if (this.props.pagenavbar.currentPage == 1) {return};
        var currentPage = this.props.pagenavbar.currentPage == 1 ? 1 : this.props.pagenavbar.currentPage - 1
        this.props.pageNumChange(currentPage)
    }

    pagedown = (e,pageNums)=>{
        if (this.props.pagenavbar.currentPage == pageNums) {return};
        var currentPage = this.props.pagenavbar.currentPage == pageNums ? pageNums : this.props.pagenavbar.currentPage + 1
        this.props.pageNumChange(currentPage)
    }

    firstpage = () =>{
        if (this.props.pagenavbar.currentPage == 1) {return};
        this.props.pageNumChange(1)
    }

    lastpage = (e,pageNums) =>{
        if (this.props.pagenavbar.currentPage == pageNums) {return};
        this.props.pageNumChange(pageNums)
    }

    pagego = (e,currentPage) =>{
        if (this.props.pagenavbar.currentPage == currentPage) {return};
        this.props.pageNumChange(currentPage)
    }


    render() {
        var items = [];
        let {pageNums,currentPage} = this.props.pagenavbar;
        // console.log('Page层:',currentPage,pageNums)
        if (pageNums) {            
            if (pageNums > 4){   //非初始化
                if ((currentPage - 1)>=3) {
                    items.push( < li key = { currentPage-7 } > < a >...< /a></li > );
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-2)} onClick={(e)=>this.pagego(e,currentPage-2)}>{currentPage-2}< /a></li > );
                    items.push( < li key = { currentPage-1 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                } else if ((currentPage - 1)>=2) {
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-2)} onClick={(e)=>this.pagego(e,currentPage-2)}>{currentPage-2}< /a></li > );
                    items.push( < li key = { currentPage-1 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                } else if ((currentPage - 1)>=1) {
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                }

                items.push( < li key = { currentPage } > < a name="pagenum" id={'pagenum'+(currentPage)} onClick={(e)=>this.pagego(e,currentPage)}>{currentPage}< /a></li > );

                if ((pageNums-currentPage)>=3) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                    items.push( < li key = { currentPage+2 } > < a name="pagenum" id={'pagenum'+(currentPage+2)} onClick={(e)=>this.pagego(e,currentPage+2)}>{currentPage+2}< /a></li > );
                    items.push( < li key = { currentPage+7 } > < a >...< /a></li > );
                } else if ((pageNums-currentPage)>=2) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                    items.push( < li key = { currentPage+2 } > < a name="pagenum" id={'pagenum'+(currentPage+2)} onClick={(e)=>this.pagego(e,currentPage+2)}>{currentPage+2}< /a></li > );
                } else if ((pageNums-currentPage)>=1) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                };

            } else{
                for (var i = 1; i <= pageNums; i++) {
                    ((i)=>{
                    items.push( < li key = { i } > < a name="pagenum" id={'pagenum'+(i)} value={i} onClick={(e)=>this.pagego(e,i)}> { i } < /a></li > );
                    })(i)
                };

            }
        };

        return ( < ul className = "pagedown" >
            < li > < button className = "btn-primary" onClick={this.firstpage}> 首页 < /button></li >
            < li > < button className = "btn-primary" onClick={this.pageup}> 上一页 </button > < /li> 
            { items } 
            < li > < button className = "btn-primary" onClick={(e)=>this.pagedown(e,pageNums)}> 下一页 </button >< /li> 
            < li > < button className = "btn-primary" onClick={(e)=>this.lastpage(e,pageNums)}> 尾页 < /button></li >
            < /ul>
        )
    }
}

PageNavBar.PropTypes = {
    pageNums:React.PropTypes.number,
    currentPage:React.PropTypes.number
}
