import {
    ArrowDownOutlined,
    ArrowUpOutlined,
  } from '@ant-design/icons';

const ArrowRender = (text, row, index)=>{
    if(text=='UNKNOWN'){
        return ''
    }
    if(text==0){
        return ''
    }
    else if(text<0){
        return <>
            <ArrowDownOutlined style={{color:'green'}}/>{-1*text}
        </>
    }else{
        return <>
            <ArrowUpOutlined style={{color:'red'}}/>{text}
        </>
    }
}
export default ArrowRender;